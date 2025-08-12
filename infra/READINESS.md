# AkiliPesa Production Readiness Checklist

## Overview
This document provides a comprehensive checklist for deploying AkiliPesa to production. The system architecture connects Builder.io (frontend) → Firebase (Auth, Firestore, Storage, Functions, Hosting) → Make.com (orchestration/payments) → RunPod (GPU workers) → RTC (ZEGOCLOUD/Agora) → AI vendors.

## Required Dependencies & Services

### Core Infrastructure
- **Firebase Project** (Auth, Firestore, Storage, Functions, Hosting)
- **Make.com Account** (Premium plan for webhooks & API access)
- **RunPod Account** (GPU endpoint access)
- **RTC Provider** (ZEGOCLOUD or Agora.io)
- **Payment Gateway** (TigoPesa, Stripe, or Mobile Money Operator)

### AI Vendors (Optional - Feature Flag Controlled)
- OpenAI (GPT-4, Whisper fallback)
- Udio (Music generation)
- Runway (Video effects)
- DeepMotion (Animation)
- Synthesia (AI avatars)
- Kaiber (Video creation)

## Environment Variables & Secrets

### Firebase Web App (.env.local)
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# App Configuration
VITE_WEB_APP_URL=https://your-project.web.app
VITE_ASSETS_CDN_URL=https://storage.googleapis.com/your_bucket

# RTC Provider (Choose one)
VITE_AGORA_APP_ID=your_agora_app_id
# OR
VITE_ZEGO_APP_ID=your_zego_app_id

# Feature Flags
VITE_FEATURE_FREEMIUM=true
VITE_FEATURE_AI_VIDEO=true
VITE_FEATURE_SOCIAL_AUTOPOST=true
VITE_FEATURE_CLONES=true

# Security
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Firebase Functions Secrets (Set via `firebase functions:secrets:set`)
```bash
# Make.com Integration
MAKE_API_TOKEN=your_make_api_token
MAKE_SIGNING_SECRET=your_webhook_signing_secret
MAKE_WEBHOOK_URL=https://hook.make.com/your_job_webhook
MAKE_CALLS_WEBHOOK_URL=https://hook.make.com/your_calls_webhook

# RTC Provider Credentials
AGORA_APP_CERT=your_agora_app_certificate
# OR
ZEGO_SERVER_SECRET=your_zego_server_secret

# RunPod GPU Endpoints
RUNPOD_API_KEY=your_runpod_api_key
RUNPOD_SD_URL=https://api.runpod.ai/v2/your_sd_endpoint
RUNPOD_VLLM_URL=https://api.runpod.ai/v2/your_vllm_endpoint
RUNPOD_WHISPER_URL=https://api.runpod.ai/v2/your_whisper_endpoint
RUNPOD_OPENVOICE_URL=https://api.runpod.ai/v2/your_openvoice_endpoint

# AI Vendor APIs (Optional)
OPENAI_API_KEY=sk-your_openai_key
UDIO_API_KEY=your_udio_key
RUNWAY_API_KEY=your_runway_key
DEEPMOTION_API_KEY=your_deepmotion_key
SYNTHESIA_API_KEY=your_synthesia_key
KAIBER_API_KEY=your_kaiber_key

# Payment Integration
PAYMENTS_PROVIDER=TIGOPESA
TIGOPESA_CLIENT_ID=your_tigo_client_id
TIGOPESA_CLIENT_SECRET=your_tigo_client_secret
TIGOPESA_BASE_URL=https://api.tigo.co.tz
CHARGE_ENABLED=true
RATE_FREE=0
RATE_PREMIUM=500

# Security & Webhooks
SOCIAL_WEBHOOK_SIGNING_SECRET=your_social_webhook_secret
```

## Human Setup Steps (Must Be Done Manually)

### 1. Firebase Project Setup
1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create new project with name "akilipesa-prod"
   - Enable Google Analytics (optional)

2. **Enable Authentication Providers**
   - Go to Authentication > Sign-in method
   - Enable Phone authentication
   - Enable Google sign-in provider
   - Configure authorized domains

3. **Configure Firestore Database**
   - Create Firestore database in production mode
   - Deploy security rules via CI

4. **Enable Storage**
   - Enable Firebase Storage
   - Deploy storage rules via CI

5. **Download Web Configuration**
   - Go to Project Settings > General
   - Add web app, copy config values to `.env.local`

6. **Set Functions Secrets**
   ```bash
   firebase functions:secrets:set MAKE_API_TOKEN
   firebase functions:secrets:set MAKE_SIGNING_SECRET
   firebase functions:secrets:set AGORA_APP_CERT
   firebase functions:secrets:set RUNPOD_API_KEY
   firebase functions:secrets:set OPENAI_API_KEY
   firebase functions:secrets:set TIGOPESA_CLIENT_SECRET
   # ... continue for all secrets listed above
   ```

### 2. Make.com Setup
1. **Create Make.com Account**
   - Sign up for Pro/Teams plan (required for API access)
   - Generate Personal Access Token

2. **Initial Deploy**
   - Set `MAKE_API_TOKEN` in CI environment
   - Run CI pipeline once to create Make scenarios
   - Copy generated webhook URLs from Make console
   - Set webhook URLs in Firebase Functions secrets:
     ```bash
     firebase functions:secrets:set MAKE_WEBHOOK_URL
     firebase functions:secrets:set MAKE_CALLS_WEBHOOK_URL
     ```
   - Redeploy Firebase Functions

### 3. RunPod Setup
1. **Provision GPU Endpoints**
   - Create endpoints for: Stable Diffusion, vLLM, Whisper, OpenVoice
   - Note endpoint IDs and base URLs
   - Generate API key

2. **Test Endpoints**
   ```bash
   # Test Stable Diffusion
   curl -X POST "$RUNPOD_SD_URL/runsync" \
     -H "Authorization: Bearer $RUNPOD_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"input": {"prompt": "test image", "steps": 20}}'

   # Test vLLM Chat
   curl -X POST "$RUNPOD_VLLM_URL/v1/chat/completions" \
     -H "Authorization: Bearer $RUNPOD_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model": "mistral", "messages": [{"role": "user", "content": "Hello"}]}'

   # Test Whisper Transcription
   curl -X POST "$RUNPOD_WHISPER_URL/transcribe" \
     -H "Authorization: Bearer $RUNPOD_API_KEY" \
     -F "audio=@test.wav"

   # Test OpenVoice TTS
   curl -X POST "$RUNPOD_OPENVOICE_URL/tts" \
     -H "Authorization: Bearer $RUNPOD_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello world", "voice_id": "default"}'
   ```

### 4. RTC Provider Setup
**Option A: ZEGOCLOUD**
1. Create ZEGOCLOUD account
2. Create application, note AppID and ServerSecret
3. Set in environment variables

**Option B: Agora.io**
1. Create Agora account
2. Create project, note AppID and App Certificate
3. Set in environment variables

### 5. Payment Gateway Setup
**TigoPesa Integration**
1. Register with TigoPesa business account
2. Obtain Client ID and Client Secret
3. Configure webhook endpoints in TigoPesa dashboard

**Alternative: Stripe**
1. Create Stripe account
2. Get publishable and secret keys
3. Configure webhook endpoints

### 6. AI Vendor Setup (Optional)
1. **OpenAI**: Create API key for fallback services
2. **Udio**: Register for music generation API
3. **Runway**: Register for video effects API
4. **DeepMotion**: Register for animation API
5. **Synthesia**: Register for AI avatar API
6. **Kaiber**: Register for video creation API

### 7. CI/CD Configuration
1. **GitHub Repository Setup**
   - Add environment secrets in GitHub repo settings
   - Configure branch protection rules
   - Enable GitHub Actions

2. **Firebase CLI Token**
   ```bash
   firebase login:ci
   # Copy token to GitHub secrets as FIREBASE_TOKEN
   ```

## Automated Setup (Handled by CI)

### CI Pipeline Will:
1. Install dependencies and run tests
2. Build web application
3. Deploy Firebase Functions
4. Deploy Firebase Hosting
5. Update Firestore security rules
6. Update Storage security rules
7. Deploy Make.com blueprints
8. Optimize and compress assets
9. Generate deployment report

### File Generation:
- `infra/env/.env.example` - All environment variables with examples
- `infra/diagram/stack.md` - System architecture diagram
- `infra/make/blueprints/*.json` - Make.com scenario configurations
- `infra/make/apply-blueprints.mjs` - Automated blueprint deployment
- `.github/workflows/deploy.yml` - CI/CD pipeline
- Updated Firestore rules and data models

## Production Smoke Tests

### Authentication Flow
- [ ] Phone number login works
- [ ] Google OAuth login works  
- [ ] Guest mode with limited features works
- [ ] Auth state persists across browser sessions

### Core Features
- [ ] Upload video/image successfully
- [ ] Submit AI job (enhance/generate) - check jobs collection
- [ ] Job completes with output URLs
- [ ] Start and end video call (1 minute test)
- [ ] Call billing record created in Firestore

### Commerce Flow
- [ ] Create product listing with price/commission
- [ ] Generate payment link via createOrder function
- [ ] Complete payment (test mode)
- [ ] Webhook marks order as paid
- [ ] Revenue split calculated correctly

### Social Sharing
- [ ] Generate watermarked reel
- [ ] Share via OS share sheet
- [ ] Track social sharing analytics
- [ ] API-based posting (where supported)

### AI Integrations
- [ ] Stable Diffusion image generation
- [ ] vLLM chat completion
- [ ] Whisper transcription
- [ ] OpenVoice text-to-speech
- [ ] Fallback to OpenAI when RunPod unavailable

### Performance & Security
- [ ] Page load times < 3 seconds
- [ ] Lazy loading works for heavy components
- [ ] HMAC webhook verification active
- [ ] Rate limiting prevents abuse
- [ ] Error boundaries catch and report issues

## Security Checklist

### Firestore Security
- [ ] Users can only read/write their own data
- [ ] Server-only fields protected from client writes
- [ ] Proper indexing for query performance
- [ ] Backup strategy configured

### API Security
- [ ] All webhook endpoints verify HMAC signatures
- [ ] Firebase Functions use proper CORS
- [ ] Storage URLs are signed and time-limited
- [ ] Rate limiting on expensive operations

### Client Security
- [ ] No secrets in client-side code
- [ ] CSP headers configured
- [ ] XSS protection enabled
- [ ] Secure cookie settings

## Monitoring & Alerting

### Firebase Monitoring
- [ ] Function execution metrics
- [ ] Firestore read/write quotas
- [ ] Storage bandwidth usage
- [ ] Authentication metrics

### Custom Alerts
- [ ] High error rates in functions
- [ ] Payment processing failures
- [ ] AI job processing delays
- [ ] Unusual user activity patterns

## Performance Targets

### Web Vitals
- **LCP**: < 2.5 seconds
- **FID**: < 100 milliseconds  
- **CLS**: < 0.1
- **FCP**: < 1.8 seconds

### API Performance
- **Function cold start**: < 3 seconds
- **Database queries**: < 500ms average
- **Storage uploads**: Resume on failure
- **AI job completion**: < 2 minutes for most operations

## Backup & Recovery

### Data Backup
- Firestore automated daily backups
- Storage bucket versioning enabled
- Functions source code in git
- Environment configuration documented

### Disaster Recovery
- Multi-region Firebase project
- Make.com scenario export/import
- RunPod endpoint redundancy
- Payment provider failover

## Cost Monitoring

### Firebase Quotas
- Firestore: Monitor read/write operations
- Functions: Track invocations and compute time
- Storage: Monitor bandwidth and storage usage
- Hosting: Track data transfer

### Third-Party Services
- Make.com: Operations count
- RunPod: GPU-hour consumption
- AI APIs: Token/request usage
- RTC: Monthly active users and minutes

## Support Contacts

### Technical Issues
- Firebase Support: [Firebase Console](https://console.firebase.google.com)
- Make.com Support: support@make.com
- RunPod Support: help@runpod.io

### Business Issues
- Payment Provider Support
- AI Vendor Support
- Legal/Compliance Questions

---

## Next Steps After Setup

1. Run full smoke test suite
2. Configure monitoring and alerting
3. Set up automated backups
4. Perform load testing
5. Security audit with external firm
6. Document operational procedures
7. Train support team on troubleshooting

**Estimated Setup Time**: 4-6 hours for experienced developer
**Recommended Team**: 1 Full-stack developer + 1 DevOps engineer
