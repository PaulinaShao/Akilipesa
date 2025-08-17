import * as functions from 'firebase-functions/v2/https';
import * as pubsubFunctions from 'firebase-functions/v2/scheduler';
import * as crypto from 'crypto';
import { checkDeviceQuota } from './rateLimiter';
import { db } from './adminApp';
import { FieldValue } from 'firebase-admin/firestore';

// Helper to get current day key
const getCurrentDay = () => new Date().toISOString().slice(0, 10).replace(/-/g, '');

// Helper to hash IP address for privacy
const hashIP = (ip: string): string => {
  return crypto.createHash('sha256').update(ip + 'trial_salt').digest('hex').slice(0, 16);
};

// Type definition for reCAPTCHA response
type TrialResult = { success?: boolean; score?: number };

function isTrialResult(x: unknown): x is TrialResult {
  return !!x && typeof x === 'object' && ('success' in (x as any) || 'score' in (x as any));
}

// Helper to validate reCAPTCHA score
async function validateCaptcha(token?: string): Promise<number> {
  if (!token) return 0.5; // Default score for development

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET || '',
        response: token,
      }),
    });

    const result = await response.json();
    if (!isTrialResult(result)) return 0;
    return result.success ? (result.score ?? 0) : 0;
  } catch (error) {
    console.warn('reCAPTCHA validation failed:', error);
    return 0.3; // Lower score on validation failure
  }
}

// Read trial configuration
async function getTrialConfig() {
  const configDoc = await db.doc('trialConfig/global').get();
  
  if (!configDoc.exists) {
    // Default configuration
    return {
      enabled: true,
      chatMessagesPerDay: 3,
      callsPerDay: 1,
      callSeconds: 90,
      reactionLimit: 5,
      happyHours: [],
      requireHappyHour: false,
      minCaptchaScore: 0.3,
    };
  }
  
  return configDoc.data()!;
}

// Issue a trial token for a new device
export const issueTrialToken = functions.onCall(async (request) => {
  const { data } = request;
  const ip = request.rawRequest?.ip || '0.0.0.0';
  const ipHash = hashIP(ip);
  const { deviceInfo, captchaToken } = data;
  
  // Validate reCAPTCHA if provided
  const captchaScore = await validateCaptcha(captchaToken);
  const config = await getTrialConfig();
  
  if (captchaScore < config.minCaptchaScore) {
    throw new functions.HttpsError(
      'permission-denied',
      'Security verification failed'
    );
  }
  
  // Generate unique token
  const tokenId = crypto.randomBytes(32).toString('hex');
  
  // Create trial document
  const trialData = {
    deviceInfo: {
      id: deviceInfo?.id || 'unknown',
      userAgent: (deviceInfo?.userAgent || '').slice(0, 200),
      screen: deviceInfo?.screen || '',
      timezone: deviceInfo?.timezone || '',
      language: deviceInfo?.language || '',
    },
    ipHash,
    dayKey: getCurrentDay(),
    chatUsed: 0,
    callsUsed: 0,
    secondsUsed: 0,
    reactionsUsed: 0,
    captchaScore,
    flagged: captchaScore < 0.5,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  
  await db.collection('trials').doc(tokenId).set(trialData);
  
  return { deviceToken: tokenId };
});

// Request a guest call
export const requestGuestCall = functions.onCall(async (request) => {
  const { data } = request;
  const { deviceToken, targetId, captchaToken } = data;

  if (!deviceToken) {
    throw new functions.HttpsError('invalid-argument', 'Device token required');
  }

  const config = await getTrialConfig();

  if (!config.enabled) {
    throw new functions.HttpsError('failed-precondition', 'Trials are currently disabled');
  }

  // Validate reCAPTCHA for call requests
  const captchaScore = await validateCaptcha(captchaToken);
  if (captchaScore < config.minCaptchaScore) {
    throw new functions.HttpsError('permission-denied', 'Security verification failed');
  }

  // Check server-side device quota
  const deviceId = data.deviceId || deviceToken.slice(0, 16);
  const quotaOk = await checkDeviceQuota(deviceId, 'call');
  if (!quotaOk) {
    throw new functions.HttpsError('resource-exhausted', 'Daily call quota exceeded');
  }

  // Check happy hour if required
  if (config.requireHappyHour && config.happyHours?.length > 0) {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const inHappyHour = config.happyHours.some((window: any) =>
      currentMin >= window.startMin && currentMin <= window.endMin
    );

    if (!inHappyHour) {
      throw new functions.HttpsError('failed-precondition', 'Calls only available during happy hours');
    }
  }

  // Update trial usage atomically
  const trialRef = db.doc(`trials/${deviceToken}`);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(trialRef);

    if (!doc.exists) {
      throw new functions.HttpsError('permission-denied', 'Invalid trial token');
    }
    
    const trial = doc.data()!;
    const currentDay = getCurrentDay();
    
    // Reset counters if new day
    if (trial.dayKey !== currentDay) {
      trial.dayKey = currentDay;
      trial.chatUsed = 0;
      trial.callsUsed = 0;
      trial.secondsUsed = 0;
      trial.reactionsUsed = 0;
    }
    
    // Check quota
    if (trial.callsUsed >= config.callsPerDay) {
      throw new functions.HttpsError('resource-exhausted', 'Daily call quota exceeded');
    }
    
    // Increment usage
    trial.callsUsed += 1;
    trial.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    transaction.set(trialRef, trial, { merge: true });
  });
  
  // Generate limited RTC token (implementation depends on your RTC provider)
  const rtcData = await generateLimitedRTCToken(targetId, config.callSeconds);
  
  return rtcData;
});

// Guest chat with AI
export const guestChat = functions.onCall(async (request) => {
  const { data } = request;
  const { deviceToken, message, captchaToken } = data;
  
  if (!deviceToken) {
    throw new functions.HttpsError('invalid-argument', 'Device token required');
  }
  
  const config = await getTrialConfig();
  
  if (!config.enabled) {
    throw new functions.HttpsError('failed-precondition', 'Trials are currently disabled');
  }
  
  // Validate input
  if (!message || typeof message !== 'string' || message.length > 500) {
    throw new functions.HttpsError('invalid-argument', 'Invalid message');
  }

  // Check server-side device quota
  const deviceId = data.deviceId || deviceToken.slice(0, 16);
  const quotaOk = await checkDeviceQuota(deviceId, 'ai');
  if (!quotaOk) {
    throw new functions.HttpsError('resource-exhausted', 'Daily AI quota exceeded');
  }
  
  // Update trial usage atomically
  const trialRef = db.doc(`trials/${deviceToken}`);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(trialRef);

    if (!doc.exists) {
      throw new functions.HttpsError('permission-denied', 'Invalid trial token');
    }
    
    const trial = doc.data()!;
    const currentDay = getCurrentDay();
    
    // Reset counters if new day
    if (trial.dayKey !== currentDay) {
      trial.dayKey = currentDay;
      trial.chatUsed = 0;
      trial.callsUsed = 0;
      trial.secondsUsed = 0;
      trial.reactionsUsed = 0;
    }
    
    // Check quota
    if (trial.chatUsed >= config.chatMessagesPerDay) {
      throw new functions.HttpsError('resource-exhausted', 'Daily chat quota exceeded');
    }
    
    // Increment usage
    trial.chatUsed += 1;
    trial.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    transaction.set(trialRef, trial, { merge: true });
  });
  
  // Generate AI response (simplified for trial)
  const aiResponse = await generateTrialAIResponse(message);
  
  return { reply: aiResponse };
});

// Increment reaction usage
export const incrementReaction = functions.onCall(async (request) => {
  const { data } = request;
  const { deviceToken } = data;
  
  if (!deviceToken) {
    throw new functions.HttpsError('invalid-argument', 'Device token required');
  }
  
  const config = await getTrialConfig();
  
  if (!config.enabled) {
    return { success: false, reason: 'Trials disabled' };
  }
  
  const trialRef = db.doc(`trials/${deviceToken}`);
  
  try {
    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(trialRef);
      
      if (!doc.exists) {
        throw new Error('Invalid trial token');
      }
      
      const trial = doc.data()!;
      const currentDay = getCurrentDay();
      
      // Reset counters if new day
      if (trial.dayKey !== currentDay) {
        trial.dayKey = currentDay;
        trial.chatUsed = 0;
        trial.callsUsed = 0;
        trial.secondsUsed = 0;
        trial.reactionsUsed = 0;
      }
      
      // Check quota
      if (trial.reactionsUsed >= config.reactionLimit) {
        throw new Error('Quota exceeded');
      }
      
      // Increment usage
      trial.reactionsUsed += 1;
      trial.updatedAt = admin.firestore.FieldValue.serverTimestamp();
      
      transaction.set(trialRef, trial, { merge: true });
    });
    
    return { success: true };
  } catch (error: any) {
    if (error.message === 'Quota exceeded') {
      throw new functions.HttpsError('resource-exhausted', 'Daily reaction quota exceeded');
    }
    throw new functions.HttpsError('permission-denied', 'Invalid trial token');
  }
});

// Helper function to generate limited RTC token
async function generateLimitedRTCToken(targetId: string, maxSeconds: number) {
  // This is a placeholder - implement based on your RTC provider (Agora/ZEGOCLOUD)
  const channelName = `trial_${targetId}_${Date.now()}`;
  const expiryTime = Math.floor(Date.now() / 1000) + maxSeconds + 30; // Add 30s buffer
  
  // For now, return mock data - replace with actual token generation
  return {
    token: 'mock_rtc_token',
    channelName,
    uid: Math.floor(Math.random() * 100000),
    expiryTime,
    maxDuration: maxSeconds,
  };
}

// Helper function to generate AI response for trial users
async function generateTrialAIResponse(message: string): Promise<string> {
  // Simple response for trial users - replace with actual AI integration
  const responses = [
    "Thanks for trying AkiliPesa! This is a trial chat. Sign up for full AI conversations!",
    "Hello! I'm the AkiliPesa AI assistant. For unlimited chats, please create an account.",
    "Great question! Trial users get limited responses. Join us for full access to AI features!",
    "Hi there! This is a trial experience. Sign up to unlock unlimited AI conversations.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// Scheduled function to reset trial counters (optional - we use dayKey logic instead)
export const resetTrialCounters = pubsubFunctions.onSchedule({
    schedule: '0 0 * * *',
    timeZone: 'Africa/Dar_es_Salaam'
  }, async (event) => {
    console.log('Trial counter reset job triggered (using dayKey logic instead)');
  });
