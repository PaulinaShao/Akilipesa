# AkiliPesa Auth Revamp v2 - QA Checklist

## ✅ Phone Input Testing
- [ ] Phone textbox caret never overlaps country code ✓
- [ ] 0713…, 713…, +255713…, 255713… all normalize to +255713123456 ✓
- [ ] Input shows TZ +255 prefix with proper formatting ✓
- [ ] Valid Tanzania numbers (6/7 prefixes) are accepted ✓
- [ ] Invalid formats show error messages ✓

## ✅ OTP/Code Input Testing
- [ ] OTP paste fills all 6 boxes ✓
- [ ] Keyboard "Next" advances between boxes ✓
- [ ] Backspace moves to previous box when current is empty ✓
- [ ] Auto-complete triggers when all 6 digits entered ✓
- [ ] Resend is disabled for 30 seconds with countdown ✓

## ✅ Auth Sheet (Bottom Sheet)
- [ ] Sheet slides up from bottom with backdrop ✓
- [ ] Escape gestures close the sheet ✓
- [ ] Phone/Email tabs work correctly ✓
- [ ] Sheet closes after successful auth ✓
- [ ] Original action executes after auth success ✓

## ✅ Guest Feed Functionality
- [ ] /reels loads without authentication required ✓
- [ ] Like button opens auth sheet for guests ✓
- [ ] Comment button opens auth sheet for guests ✓
- [ ] Follow button opens auth sheet for guests ✓
- [ ] Share button opens auth sheet for guests ✓
- [ ] Buy/Shop actions open auth sheet for guests ✓
- [ ] Message/Call actions open auth sheet for guests ✓
- [ ] Live/Join actions open auth sheet for guests ✓

## ✅ Splash Screen
- [ ] Plays sparkle animation once per session ✓
- [ ] Skips animation on return visits (localStorage check) ✓
- [ ] 1.2s animation with Tanzanite gem and sparkles ✓
- [ ] Redirects to /reels after animation ✓

## ✅ Google Authentication
- [ ] Google button uses official white styling ✓
- [ ] Google logo and colors are correct ✓
- [ ] Loading states work properly ✓

## ✅ Design & Accessibility
- [ ] Tanzanite theme throughout (deep navy → violet gradients) ✓
- [ ] Dark mode contrast passes WCAG AA ✓
- [ ] Buttons have proper hover/focus states ✓
- [ ] Animations respect prefers-reduced-motion ✓

## ✅ Navigation & Flow
- [ ] /splash → /reels flow works ✓
- [ ] /login full-screen variant works ✓
- [ ] Auth sheet variant works for guest actions ✓
- [ ] Post-auth action execution works ✓
- [ ] All routes accessible and no dead ends ✓

## 🔧 Integration Points
- [ ] Firebase Auth integration ready for production
- [ ] reCAPTCHA Enterprise remains functional
- [ ] Existing auth providers preserved
- [ ] Phone auth (OTP) backend integration ready
- [ ] Google OAuth integration ready

## 📱 Mobile Experience
- [ ] Touch targets are 44px+ for accessibility
- [ ] Gestures work on mobile devices
- [ ] Virtual keyboard doesn't break layout
- [ ] Sheet animations smooth on mobile
- [ ] Phone input works with mobile keyboards

## 🚀 Performance
- [ ] Sparkle animations use CSS transforms (GPU)
- [ ] Framer Motion animations optimized
- [ ] Bundle size impact acceptable
- [ ] No memory leaks in auth flow
- [ ] Smooth 60fps animations

---

## Implementation Summary

### New Components Created:
- `PhoneInput.tsx` - Tanzania-focused phone input with TZ +255 prefix
- `CodeInput.tsx` - 6-digit OTP input with auto-advance and paste support
- `GoogleButton.tsx` - Official Google OAuth button styling
- `AuthSheet.tsx` - Bottom sheet modal for guest auth
- `SplashPage.tsx` - Animated Tanzanite splash screen

### New Utilities:
- `phone.ts` - Tanzania phone number normalization and validation
- `useAuthGate.ts` - Hooks for gating guest actions
- `uiStore.ts` - Zustand store for UI state management
- `sparkle.css` - Performance-optimized sparkle animations

### Updated Pages:
- `LoginPage.tsx` - Rewritten with new WhatsApp-style UI
- `ReelsPage.tsx` - Added auth gating for all guest actions
- `App.tsx` - Added AuthSheet and splash route

### Key Features:
1. **Guest Feed**: Full TikTok-like browsing without auth
2. **Auth Gating**: Smart prompts for like/comment/follow/share actions
3. **WhatsApp UX**: Clean, modern auth flow inspired by WhatsApp
4. **Tanzania Focus**: Proper +255 phone handling and validation
5. **Sparkle Branding**: Subtle Tanzanite gem animations
6. **Accessibility**: WCAG AA contrast and mobile-first design
