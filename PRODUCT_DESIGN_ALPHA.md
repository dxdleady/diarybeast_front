# Product Design - Alpha v0.1

## Executive Summary

**DiaryBeast** is a Web3 gamified journaling app where users write daily entries to feed and evolve their virtual pet. The Alpha version focuses on core functionality that can be realistically built in 2-3 days of development.

**Target:** Crypto-curious users interested in self-reflection and gamification
**Timeline:** 2-3 days development
**Platform:** Web (mobile-responsive)

---

## Alpha Scope: What We're Building

### Core User Journey (Minimal Viable Experience)

```
1. Connect Wallet → 2. Choose Pet → 3. Write Entry → 4. Pet Reacts → 5. Earn Tokens
```

---

## Features Breakdown

### Phase 1: Must Have (Day 1-2) ✅

#### 1. Authentication & Onboarding
- **Wallet Connection**
  - Base Account (Coinbase Smart Wallet) integration
  - One-click connect
  - Auto-create user profile on first login

- **Quick Onboarding (Simplified)**
  - Choose 1 of 2 pets (Cat or Dog)
  - Skip diary type selection for Alpha → default to "Personal Journal"
  - Takes < 30 seconds

**Why simplified:** Full onboarding adds complexity. Users want to start writing fast.

---

#### 2. Daily Entry Writing

**Interface:**
- Clean, distraction-free text editor
- Placeholder text: "How was your day?"
- Character counter (optional)
- Single "Save & Sign" button

**Backend Logic:**
- 1 entry per day limit (enforced server-side)
- Client-side encryption with wallet signature
- Store: `encryptedContent`, `signature`, `contentHash`, `wordCount`
- No rich text formatting in Alpha (plain text only)

**Success State:**
- Entry saved confirmation
- Pet animation (happy/excited state)
- Token reward notification (+10 DIARY)

---

#### 3. Virtual Pet (Enhanced Tamagotchi System)

**Visual:**
- **ASCII Art animations** (default mode) 🎨
- Toggle to Emoji/SVG modes
- 7 animated states with color themes

**Lives System:**
- Maximum: 7 hearts (❤️❤️❤️❤️❤️❤️❤️)
- Grace period: 24 hours without penalty
- Loss: -1 heart per 24h after grace period
- Restore: +2 hearts per diary entry
- Instant restore: Feed action (+1 heart, 8h cooldown)

**Happiness System (NEW!):**
- Range: 0-100 with visual progress bar
- Decay: -5 per 4 hours inactive
- Restore: +20 per diary entry
- Boost: +10 from Play action (4h cooldown)

**7 Animation States:**
1. **idle** - Calm resting (default)
2. **happy** - Bouncing with joy (happiness ≥70, lives ≥5)
3. **sad** - Crying (happiness <30 OR lives ≤2)
4. **critical** - Near death (lives = 0)
5. **eating** - Consuming food (Feed action, 1.5s)
6. **playing** - Dancing with ball (Play action OR music playing! 🎵)
7. **sleeping** - ZZZ state (inactive >12 hours)

**Interactive Actions:**
- 🍖 **Feed:** +1 life (8h cooldown, FREE in alpha)
- 🎾 **Play:** +10 happiness (4h cooldown, FREE in alpha)

**Special Feature:** Pet **dances when music plays**! 🎵✨

---

#### 4. Token System (On-Chain)

**Smart Contract:**
- ERC20 non-transferable token (DIARY)
- Deployed on Base Sepolia (testnet)
- Functions:
  - `mintReward(address user, uint256 amount)` - owner only
  - `burn(uint256 amount)` - user can burn own tokens
  - `burnFrom(address user, uint256 amount)` - owner only (for purchases)

**Rewards:**
- Daily entry: +10 DIARY (auto-mint on save)
- First entry ever: +50 DIARY (one-time bonus)

**Display:**
- Token balance shown in header
- Transaction hash link to Base block explorer

---

#### 5. Basic Shop (Minimal)

**Items:**
- 3 background images for diary page
  - Default (free)
  - "Sunset" - 50 DIARY
  - "Night Sky" - 100 DIARY

**Purchase Flow:**
- Click item → "Buy for X DIARY" → confirm
- Backend burns tokens from user
- Item unlocked immediately
- Background applied to diary page

**No complex customization UI:** Just image swap on diary page.

---

### Phase 2: Nice to Have (Day 3, if time permits) ⚡

#### 6. Streak Tracking
- Display current streak: "🔥 3 days"
- Simple counter (no complex calendar visualization)
- Bonus at 7 days: +100 DIARY

#### 7. Music Player (Ultra-Simplified)
- 3 hardcoded audio URLs (Mubert or royalty-free music)
- Single genre: "Calm"
- Play/Pause button only
- Persists across navigation (global state)

**Implementation:** HTML5 `<audio>` tag with React context.

#### 8. View Past Entries
- Simple list view (date + first 50 chars preview)
- Click to decrypt and view full entry
- No editing (read-only)

---

## What We're NOT Building in Alpha

### Explicitly Cut Features ❌

| Feature | Why Postponed | Future Version |
|---------|---------------|----------------|
| Entry editing | Complex state management | v0.2 |
| Rich text editor | Third-party library integration | v0.2 |
| Calendar view | UI complexity | v0.2 |
| Multiple diary types | Simplifies onboarding | v0.3 |
| Advanced pet animations | Time-consuming | v0.3 |
| Pet accessories shop | Requires more assets | v0.3 |
| Analytics dashboard | Needs data collection period | v1.0 |
| AI summaries | Requires AI integration | v1.0 |
| Social features | Out of scope | v2.0 |
| Mobile app | Web-first approach | v2.0 |

---

## User Stories for Alpha

### US-1: First-Time User
```
As a new user,
I want to connect my wallet and start writing in under 1 minute,
So that I can quickly try the app without friction.

Acceptance Criteria:
- Wallet connection takes < 5 clicks
- Onboarding takes < 30 seconds
- First entry saved successfully
- Pet appears and reacts
- Tokens credited (+60 DIARY: 50 first entry + 10 daily)
```

### US-2: Returning User
```
As a returning user,
I want to see my pet's status and write my daily entry,
So that I maintain my streak and keep my pet healthy.

Acceptance Criteria:
- Pet health (lives) displayed on landing
- Current streak visible
- Can write 1 entry per day
- Previous entries accessible
- Token balance updated after entry
```

### US-3: Token Spender
```
As a user with tokens,
I want to buy a background for my diary,
So that I can personalize my writing experience.

Acceptance Criteria:
- Can view 3 backgrounds in shop
- Can purchase with DIARY tokens
- Tokens burned on-chain
- Background applied immediately
- Transaction confirmed
```

---

## Design Principles (Inspired by Mindsera)

### 1. Minimalism First
- **Dark theme by default** (easier on eyes for writing)
- **Generous whitespace**
- **Single-column layout** (mobile-first)
- **Large, readable fonts** (18px+ for body text)

### 2. Distraction-Free Writing
- No sidebars when writing
- Full-screen text editor option
- No character limits
- Auto-save every 30 seconds (draft state)

### 3. Instant Feedback
- Immediate visual response on actions
- Pet reaction animations
- Token reward notifications
- Success/error toasts

### 4. Clear Information Hierarchy
```
Header: Logo | Token Balance | Wallet
Body: Pet (top) → Editor (center) → Save Button
Footer: Music Player (if time permits)
```

---

## UI Mockup (Text-Based)

### Main Diary Page
```
┌────────────────────────────────────────────┐
│  🐕 DiaryBeast        💰 120 DIARY   🔗 0x...│
├────────────────────────────────────────────┤
│                                            │
│            [Pet Image - Happy]             │
│        Pet Health: ❤️❤️❤️❤️❤️❤️❤️           │
│            Current Streak: 🔥 5            │
│                                            │
├────────────────────────────────────────────┤
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ How was your day?                    │ │
│  │                                      │ │
│  │ [User types here...]                 │ │
│  │                                      │ │
│  │                                      │ │
│  │                                      │ │
│  └──────────────────────────────────────┘ │
│             [Save & Sign Entry]            │
│                                            │
├────────────────────────────────────────────┤
│  🎵 ▶ Calm Music                          │
└────────────────────────────────────────────┘
```

### Shop Page
```
┌────────────────────────────────────────────┐
│  Shop - Backgrounds                        │
├────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │[Default]│  │ [Sunset]│  │[NightSky]│   │
│  │  FREE   │  │ 50 DIARY│  │100 DIARY │   │
│  │ Active  │  │  [Buy]  │  │  [Buy]   │   │
│  └─────────┘  └─────────┘  └─────────┘    │
└────────────────────────────────────────────┘
```

---

## Technical Constraints for 2-3 Days

### What's Realistic:

✅ **Day 1:**
- Next.js project setup + Tailwind
- Wallet connection (OnchainKit)
- Smart contract deployment (Base Sepolia)
- Basic UI (home + diary page)

✅ **Day 2:**
- Entry creation API
- Encryption + signature verification
- Token minting integration
- Pet display + state logic
- Shop page + purchase flow

✅ **Day 3 (Buffer):**
- Streak tracking
- Past entries view
- Music player (if time)
- Bug fixes + testing

### What's NOT Realistic:

❌ Custom animations (use pre-made sprites)
❌ Complex UI libraries (keep it vanilla)
❌ Full test coverage (manual testing only)
❌ Production-ready error handling
❌ Multi-language support
❌ SEO optimization

---

## Success Criteria for Alpha

### Functional
- ✅ User can connect wallet
- ✅ User can create encrypted entry
- ✅ Tokens minted on-chain
- ✅ Shop purchase burns tokens
- ✅ Pet state reflects user activity

### Technical
- ✅ Deployed to Vercel
- ✅ Smart contract on Base Sepolia
- ✅ No console errors
- ✅ Mobile responsive (basic)

### User Experience
- ✅ Onboarding < 1 minute
- ✅ Entry creation < 30 seconds
- ✅ No confusing states
- ✅ Clear feedback on all actions

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Smart contract bugs | High | Use OpenZeppelin templates, test on Sepolia |
| Encryption complexity | Medium | Use well-tested libraries (ethers.js) |
| Wallet connection issues | Medium | Use OnchainKit (maintained by Coinbase) |
| Time overrun | High | Cut nice-to-have features aggressively |
| No design assets | Low | Use placeholder SVGs/emojis |

---

## Post-Alpha Feedback Loop

### Questions for Users:
1. Was onboarding clear?
2. Is the pet engaging?
3. Do you understand the token system?
4. What features are you missing?
5. Would you write daily for 7 days?

### Metrics to Track:
- Wallet connections
- Daily active entries
- Token circulation
- Retention (D1, D3, D7)
- Shop conversion rate

---

## Next Steps After Alpha

### Beta (v0.2) - 1 week:
- Entry editing
- Rich text editor (Tiptap or similar)
- Calendar view
- More shop items (5-10 backgrounds + 3 music genres)
- Improved pet animations

### v1.0 - 1 month:
- Analytics dashboard
- AI-generated insights (emotional analysis)
- Premium plan ($5/mo for unlimited entries)
- Achievement badges
- Referral system

---

## Resources Needed

### Design:
- 2 pet images (Cat, Dog) - 2 states each (happy, sad)
- 3 background images (1024x768px)
- Logo + favicon

### Development:
- Next.js 14+ boilerplate
- OnchainKit documentation
- Mubert API key (for music, if included)
- Vercel account
- Base Sepolia testnet ETH

### APIs/Services:
- Vercel Postgres (free tier)
- Base RPC endpoint
- OnchainKit API key (free)

---

## Timeline Breakdown (Realistic)

### Day 1 (8 hours):
- [2h] Project setup (Next.js + Tailwind + dependencies)
- [2h] Smart contract (write, test, deploy to Sepolia)
- [2h] Wallet connection UI + OnchainKit integration
- [2h] Onboarding flow (pet selection)

### Day 2 (8 hours):
- [3h] Entry creation (UI + encryption + API)
- [2h] Token minting integration
- [2h] Shop UI + purchase flow
- [1h] Pet state logic

### Day 3 (8 hours):
- [2h] Streak tracking
- [2h] View past entries
- [1h] Music player (if time)
- [2h] Bug fixes + UI polish
- [1h] Deploy to Vercel

**Total: 24 hours over 3 days**

---

## Conclusion

This Alpha is designed to be **maximally achievable** in 2-3 days while delivering a **complete core experience**. We're cutting ruthlessly to focus on the essential loop:

> **Write → Earn → Customize → Repeat**

Everything else is noise that can be added in future iterations based on user feedback.

---

**Approved by:** [Product Owner]
**Date:** October 6, 2025
**Status:** Ready for Development
