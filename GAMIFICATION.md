# DiaryBeast - Gamification System Documentation

> **"Turn journaling into an engaging game with your virtual pet companion"**

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Pet System](#pet-system)
3. [Token Economy](#token-economy)
4. [Streak System](#streak-system)
5. [Statistics & Progress](#statistics--progress)
6. [Shop & Customization](#shop--customization)
7. [User Journey](#user-journey)

---

## Overview

DiaryBeast uses **gamification mechanics** to build sustainable journaling habits through:

- 🐾 **Virtual Pet Companion** - Lives depend on your consistency
- 💎 **DIARY Token Rewards** - Real on-chain tokens you can spend
- 🔥 **Streak Tracking** - Build momentum with consecutive days
- 🛍️ **Customizable Shop** - Unlock backgrounds and themes
- 📊 **Progress Metrics** - Track your growth over time

The core loop: **Write → Earn → Customize → Care for Pet → Repeat**

---

## Pet System

### 🐾 Available Pets

**Alpha Version:**
- 🐱 **Cat** - Independent and playful
- 🐶 **Dog** - Loyal and energetic

Each pet has unique:
- ASCII art animations (7 states)
- Emoji representations
- Personality-based reactions

### ❤️ Health System (Lives)

**Maximum:** 7 lives
**Display:** ❤️❤️❤️❤️❤️❤️❤️

**How Lives Work:**
- Start with **7/7 lives**
- **Lose 1 life** every 24 hours without a diary entry (after 24h grace period)
- **Restore +2 lives** when you write an entry
- Pet's emotional state reflects remaining lives

**States Based on Lives:**
| Lives | State | Visual | Emoji (Cat/Dog) |
|-------|-------|--------|-----------------|
| 7-4 | **Happy** | Bouncing | 😺 / 🐶 |
| 3-1 | **Sad** | Still | 😿 / 🐕‍🦺 |
| 0 | **Critical** | Pulsing | 🙀 / 😵 |

**Grace Period:** 24 hours after last entry before losing first life.

---

### 😊 Happiness System

**Maximum:** 100 happiness
**Display:** Progress bar (0-100)

**How Happiness Works:**
- **Decay:** -5 happiness every 4 hours of inactivity
- **Restore:** +20 happiness per diary entry
- **Boost:** +10 happiness when you **Play** with pet

**Happiness States:**
| Range | Status | Color |
|-------|--------|-------|
| 80-100 | Very Happy | 🟢 Green |
| 60-79 | Happy | 🟡 Yellow |
| 40-59 | Neutral | 🟠 Orange |
| 20-39 | Unhappy | 🔴 Red |
| 0-19 | Very Sad | 🔴 Red |

---

### 🎮 Interactive Actions

#### 🍖 Feed (Restore Health)
- **Effect:** +1 life
- **Cooldown:** 8 hours
- **Cost:** FREE (alpha)
- **Animation:** Eating (3 frames, 1.5 seconds)
- **Disabled when:** Lives = 7 (max health)

#### 🎾 Play (Boost Happiness)
- **Effect:** +10 happiness
- **Cooldown:** 4 hours
- **Cost:** FREE (alpha)
- **Animation:** Playing (4 frames, 1.6 seconds)
- **Disabled when:** Happiness = 100 (max)

---

### 🎨 ASCII Animations

**Toggle:** Switch between Emoji and ASCII art modes

**7 Animation States:**

1. **Idle** (3 frames, 2s) - Calm resting
2. **Happy** (4 frames, 1.2s) - Bouncing with joy
3. **Sad** (2 frames, 2s) - Crying/whimpering
4. **Critical** (2 frames, 1.6s) - Near death
5. **Eating** (3 frames, 1.5s) - Consuming food
6. **Playing** (4 frames, 1.6s) - Playing with ball
7. **Sleeping** (2 frames, 2.4s) - ZZZ sleep state

**Color Coding:**
- **Happy:** Green glow, bright colors
- **Sad:** Gray tones, blue tears
- **Critical:** Red pulsing, dark colors
- **Eating:** Orange/amber warm tones
- **Playing:** Yellow/blue energetic colors
- **Sleeping:** Purple/blue calm tones

---

## 💎 Token Economy

### DIARY Token

**Type:** ERC20 (Non-transferable / Soul-bound)
**Blockchain:** Base Sepolia (testnet)
**Contract:** `0xeA621096594d5D7E3b2232A4F38365AdA9D92c14`

**Properties:**
- ✅ Earn by writing
- ✅ Spend in shop
- ❌ Non-transferable (can't sell or trade)
- ❌ Can't be sent to others

---

### 💰 How to Earn DIARY

#### Daily Writing Rewards
- **First Entry Ever:** +50 DIARY 🎉
- **Daily Entry:** +10 DIARY per entry
- **One entry per day limit**

#### Streak Milestone Bonuses
| Streak | Bonus | Label |
|--------|-------|-------|
| 3 days | +5 DIARY | 3-Day Streak |
| 7 days | +20 DIARY | Week Streak |
| 14 days | +50 DIARY | 2-Week Streak |
| 30 days | +100 DIARY | Month Streak |
| 60 days | +250 DIARY | 2-Month Streak |
| 90 days | +500 DIARY | 3-Month Streak |
| 180 days | +1000 DIARY | 6-Month Streak |
| 365 days | +5000 DIARY | Year Streak 🏆 |

#### Example Earnings
```
Day 1: First entry → +50 (first bonus) + 10 (daily) = 60 DIARY
Day 2: Entry → +10 DIARY
Day 3: Entry → +10 + 5 (streak bonus) = 15 DIARY
Day 7: Entry → +10 + 20 (week bonus) = 30 DIARY
Day 30: Entry → +10 + 100 (month bonus) = 110 DIARY

Total after 30 days: 50 + (29 × 10) + 5 + 20 + 50 + 100 = 515 DIARY
```

---

### 💸 How to Spend DIARY

#### Shop Items (Alpha)
- **Backgrounds:** 50-100 DIARY
  - Sunset Theme: 50 DIARY
  - Ocean Theme: 75 DIARY
  - Forest Theme: 100 DIARY
  - Space Theme: 100 DIARY

#### Coming Soon
- **Pet Accessories:** Hats, glasses, outfits
- **Music Themes:** Custom ambient tracks
- **Premium Features:** Advanced analytics

---

## 🔥 Streak System

### How Streaks Work

**Definition:** Consecutive days writing diary entries

**Rules:**
- Write at least 1 entry per day to maintain streak
- Streak resets to 1 if you miss a day
- Crossing midnight counts as new day
- Grace period: 24 hours from last entry

**Calculation:**
```
If today's entry AND yesterday's entry exist:
  streak += 1
Else:
  streak = 1
```

---

### Streak Visualization

**Current Streak:** Displayed as 🔥 X days

**Streak Calendar:** 7-day calendar showing:
- ✅ Green: Entry written
- ❌ Red: Day missed
- 📝 Today: Current day

**Progress to Next Milestone:**
- Progress bar showing % to next bonus
- "X days to go" counter
- Next milestone name + reward

---

### Streak Recovery

**No recovery in Alpha** - miss a day = streak resets

**Future Features:**
- Streak Freeze (1 per week)
- Streak Insurance (paid with DIARY)
- Makeup entries (write 2x in one day)

---

## 📊 Statistics & Progress

### Tracked Metrics

| Metric | Description | Display |
|--------|-------------|---------|
| **Lives** | Pet health (0-7) | ❤️ hearts |
| **Happiness** | Pet mood (0-100) | Progress bar |
| **DIARY Balance** | Tokens earned | 💎 number |
| **Current Streak** | Consecutive days | 🔥 days |
| **Longest Streak** | Personal record | 🏆 days |
| **Total Entries** | All-time count | 📝 number |
| **Last Active** | Time since last entry | "X hours ago" |

---

### Progress Tracking

**Daily:**
- Entry written today? ✅/❌
- Lives restored: +2
- Tokens earned: +10 (+bonus)

**Weekly:**
- Days written this week: X/7
- AI-powered summary (opt-in)
- Emotional trends

**Monthly:**
- Total entries
- Streak progress
- Tokens earned
- Shop purchases

---

## 🛍️ Shop & Customization

### Current Shop Categories

#### 🎨 Persona Items (Backgrounds)
- **Default** - FREE (always owned)
- **Sunset** - 50 DIARY
- **Ocean** - 75 DIARY
- **Forest** - 100 DIARY
- **Space** - 100 DIARY

**How to Purchase:**
1. Navigate to `/shop`
2. Click "Buy" on desired background
3. Confirm purchase (tokens burned on-chain)
4. Background unlocked instantly
5. Click "Apply" to activate

**Active Background:**
- Applied to diary page
- Visible in all diary sessions
- Switch anytime (no extra cost)

---

### ✨ Pet Accessories (Coming Soon)

**Categories:**
- **Hats:** Crown, Santa hat, wizard hat
- **Glasses:** Sunglasses, reading glasses
- **Outfits:** Costumes, seasonal wear
- **Toys:** Balls, bones, yarn

**Price Range:** 50-200 DIARY

---

### 🐾 Collectible Pets (Q1 2025)

**NFT Integration:**
- Use your existing NFTs as pets
- Blue-chip partnerships (Azuki, Doodles, etc.)
- Exclusive DiaryBeast NFT collection
- Pets with special abilities

---

## 🚀 User Journey

### First Time User

```
1. Connect Wallet (Coinbase Smart Wallet)
   ↓
2. Onboarding: Choose Pet (Cat or Dog)
   ↓
3. Name Your Pet (optional)
   ↓
4. Write First Entry
   ↓
5. Earn 60 DIARY (50 first bonus + 10 daily)
   ↓
6. Pet Reacts: Happy state, +2 lives restored
   ↓
7. Success Modal shows rewards
   ↓
8. Dashboard: View stats, pet, shop
```

---

### Daily User Loop

```
Start of Day:
- Check pet status (lives, happiness)
- See streak progress

Write Entry:
- Open diary page
- Write thoughts (encrypted)
- Click "Save & Sign"

Receive Rewards:
- +10 DIARY (+ streak bonus if milestone)
- +2 lives restored
- +20 happiness
- Pet animates to "happy" state

Interact with Pet (Optional):
- 🍖 Feed (if cooldown ready)
- 🎾 Play (if cooldown ready)
- Toggle ASCII art mode

Explore Shop:
- Check balance
- Buy backgrounds/items
- Customize experience
```

---

### Returning After Absence

```
Scenario: User hasn't written for 3 days

Check-in:
- Pet has lost 3 lives (24h × 3)
- Happiness decayed: -15 (5 × 3 every 4h)
- Pet state: "Sad" (😿 / 🐕‍🦺)
- Streak reset to 0

Recovery:
1. Write entry immediately
   → +2 lives
   → +20 happiness
   → Streak = 1

2. Feed pet (if available)
   → +1 life
   → Animation: eating

3. Play with pet
   → +10 happiness
   → Animation: playing

4. Pet state improves: "Happy" state restored
```

---

## 🎯 Success Metrics

### User Engagement (KPIs)

**Retention:**
- D1 (Day 1): 60%+
- D7 (Day 7): 30%+
- D30 (Day 30): 15%+

**Activity:**
- Daily active entries: 70%+
- Avg entries per user per week: 4+
- 7-day streak completion: 20%+

**Monetization:**
- Shop conversion rate: 30%+
- Tokens spent per user: 100+ DIARY
- Active background users: 50%+

---

### Behavioral Goals

1. **Habit Formation:** Users write 5+ consecutive days
2. **Emotional Connection:** Pet name chosen by 80%+
3. **Token Utility:** 60%+ users make a purchase
4. **Retention Driver:** 40%+ return to check pet even when not writing

---

## 🔮 Future Roadmap

### Beta (v0.2) - Next 3 Months
- [ ] Rich text editor
- [ ] More shop items (10+ backgrounds)
- [ ] Pet accessories
- [ ] Calendar view
- [ ] Enhanced animations

### v1.0 - 6 Months
- [ ] AI emotional analysis
- [ ] Insights dashboard
- [ ] Achievement badges
- [ ] Referral system
- [ ] Streak freeze/insurance

### v2.0 - 12 Months
- [ ] NFT pet collectibles
- [ ] Multiplayer features
- [ ] Community leaderboards
- [ ] Mobile app (iOS/Android)
- [ ] Multiple pets per user

---

## 💡 Design Philosophy

### Core Principles

1. **Respect, Not Manipulation**
   - No dark patterns
   - No guilt-tripping
   - Celebrate, don't punish

2. **Tangible Rewards**
   - Real blockchain tokens
   - Actual ownership
   - Meaningful customization

3. **Emotional Connection**
   - Pet feels alive
   - Reactions feel genuine
   - Care creates bond

4. **Privacy First**
   - Encrypted entries
   - No AI by default
   - User controls data

5. **Simple & Delightful**
   - Easy to start
   - Fun to continue
   - Beautiful to use

---

## 📞 Support & Feedback

**Questions?** hello@diarybeast.app
**GitHub:** [github.com/dxdleady/diarybeast_front](https://github.com/dxdleady/diarybeast_front)
**Discord:** Coming soon
**Twitter:** @diarybeast (coming soon)

---

**Document Version:** 1.0
**Last Updated:** October 12, 2025
**Status:** Alpha v0.1

---

*Feed your beast. Build your streak. Own your words.* 🐾
