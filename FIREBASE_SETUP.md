# Firebase Functions & Agora Integration Setup

This document outlines the complete setup for Firebase Functions with Agora RTC token generation and automated GitHub CI deployment.

## 🔧 Prerequisites

### 1. Secret Manager Setup
Ensure these secrets exist in Google Cloud Secret Manager:
- `AGORA_APP_ID` - Your Agora application ID
- `AGORA_APP_CERT` - Your Agora application certificate

Grant the Firebase Functions service account `Secret Manager Secret Accessor` role:
```bash
# Get the Functions service account
gcloud projects get-iam-policy akilipesa-prod

# Grant access (replace with your actual service account)
gcloud projects add-iam-policy-binding akilipesa-prod \
  --member="serviceAccount:akilipesa-prod@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 2. Firebase Project Configuration
Ensure your Firebase project `akilipesa-prod` is properly configured:
- Functions enabled
- Firestore enabled
- Authentication enabled with Google/Phone providers

## 🚀 GitHub Actions Setup

### Option A: Workload Identity (Recommended - More Secure)

1. **Set up Workload Identity Federation in Google Cloud**
2. **Add these secrets to your GitHub repository:**
   - `GCP_WORKLOAD_IDENTITY_PROVIDER`
   - `GCP_SERVICE_ACCOUNT_EMAIL`

### Option B: Firebase Token (Simpler - Less Secure)

1. **Generate Firebase CLI token:**
   ```bash
   firebase login:ci
   ```

2. **Add this secret to your GitHub repository:**
   - `FIREBASE_TOKEN` - The token from step 1

3. **Use the alternative workflow:**
   - Rename `.github/workflows/firebase-functions-simple.yml.example` to `.github/workflows/firebase-functions.yml`

## 📁 Project Structure

```
├── firebase/
│   ├── functions/
│   │   ├── src/
│   │   │   └── index.ts          # Functions code
│   │   ├── package.json          # Dependencies
│   │   └── tsconfig.json         # TypeScript config
│   └── firebase.json             # Firebase config
├── .github/
│   └── workflows/
│       └── firebase-functions.yml # CI/CD workflow
└── apps/web/                     # Your web application
```

## 🔑 Authentication Setup

### Google Sign-In Configuration

1. **Add authorized domains in Firebase Console:**
   - Go to Authentication → Settings → Authorized domains
   - Add all Builder.io preview domains and production domains

2. **OAuth Configuration:**
   - Ensure proper OAuth client IDs are configured
   - Add your domain to authorized origins

### User Document Creation

The authentication system now automatically creates/merges user documents in Firestore:

```typescript
// User document structure in /users/{uid}
{
  displayName: string,
  email?: string,
  phoneNumber?: string,
  photoURL?: string,
  plan: "free" | "starter" | "premium" | "business",
  role: "user" | "creator" | "moderator" | "admin",
  createdAt: Timestamp,
  lastSignIn: Timestamp
}
```

## 🎯 API Usage

### RTC Token Generation

The deployed function can be called from your web app:

```typescript
// In your web app (apps/web/src/lib/api.ts)
const response = await fetch('/getRtcToken?channel=mychannel&uid=12345');
const data = await response.json();
// Returns: { appId, channel, uid, token, expiresIn }
```

### Agora Integration

Use the returned token data to join Agora calls:

```typescript
// Example usage in CallScreen component
const rtcData = await getRtc();
await join({
  appId: rtcData.appId,
  channel: rtcData.channel,
  token: rtcData.token,
  uid: parseInt(rtcData.uid)
});
```

## 🔄 Deployment Process

1. **Automatic Deployment:**
   - Push changes to `main` branch
   - GitHub Actions automatically builds and deploys Functions
   - Only triggers on changes to relevant files

2. **Manual Deployment:**
   ```bash
   cd firebase/functions
   npm run build
   firebase deploy --only functions --project akilipesa-prod
   ```

## 🐛 Troubleshooting

### Common Issues

1. **"Missing Agora secrets" error:**
   - Verify secrets exist in Secret Manager
   - Check service account permissions

2. **CORS errors:**
   - Functions are configured with `cors: true`
   - Check if client domains are properly authorized

3. **Authentication not persisting:**
   - Ensure `isRealUser()` checks are used correctly
   - Verify Firestore user documents are being created

4. **Firestore "Listen … TYPE=terminate 400" warnings:**
   - These are harmless but can be fixed by properly unsubscribing listeners
   - Ensure `useEffect` cleanup functions call `unsubscribe()`

### Testing Functions Locally

```bash
# Start Firebase emulators
cd firebase/functions
npm run serve

# Test the function
curl "http://localhost:5001/akilipesa-prod/us-central1/getRtcToken?channel=test&uid=123"
```

## 📊 Monitoring

- Monitor Functions in Firebase Console
- Check logs for errors or performance issues
- Set up alerting for function failures

## 🔒 Security Notes

- RTC tokens expire after 5 minutes for security
- Anonymous users are properly linked to prevent account explosion
- Secrets are managed through Google Cloud Secret Manager
- Service accounts follow principle of least privilege
