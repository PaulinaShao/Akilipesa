// Simple test script to verify getRtc function
import { getRtc } from './lib/api';

// Test the getRtc function
export async function testRtcFunction() {
  try {
    console.log('Testing getRtc function...');
    const result = await getRtc();
    console.log('getRtc success:', result);
    return result;
  } catch (error) {
    console.error('getRtc failed:', error);
    throw error;
  }
}

// Auto-run if we're in development
if (import.meta.env.DEV) {
  // Delay execution to ensure everything is loaded
  setTimeout(() => {
    testRtcFunction()
      .then(result => {
        console.log('✅ RTC Token test passed:', {
          appId: result.appId,
          channel: result.channel,
          uid: result.uid,
          hasToken: !!result.token,
          expiresIn: result.expiresIn
        });
      })
      .catch(error => {
        console.log('❌ RTC Token test failed:', error.message);
      });
  }, 2000);
}
