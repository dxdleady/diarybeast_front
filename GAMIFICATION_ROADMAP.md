# DiaryBeast Gamification Roadmap

> **Evolution of the Tamagotchi-Style Journaling System**

---

## 📋 Table of Contents

1. [Motivation & Value Proposition](#motivation--value-proposition)
2. [Current State - Prototype Phase](#prototype-phase-current)
3. [Alpha Phase - Enhanced Mechanics](#alpha-phase)
4. [Beta Phase - Breeding & Generations](#beta-phase)
5. [Future Phases - Advanced Features](#future-phases)

---

## 💎 Motivation & Value Proposition

### 🎯 Current Motivation Analysis (Prototype)

**What Works:**
- ✅ **Immediate feedback loop** - Write entry → earn tokens → restore pet lives
- ✅ **Loss aversion** - Pet dies without entries (strong motivation)
- ✅ **Reward multipliers** - Poor pet health = reduced rewards (double incentive)
- ✅ **Streak system** - Bonuses for consistency (7d/30d/100d)

**What Doesn't Work:**
- 🔴 **Limited token utility** - Few items to purchase
- 🔴 **No pet evolution** - No long-term progression goal
- 🔴 **Missing discovery** - No surprise/mystery mechanics
- 🔴 **No social proof** - Progress is invisible to others
- 🔴 **Repetitive gameplay** - Same loop every day

---

### 🚀 Priority Improvements

#### **Phase 1: Token Utility** (2-3 weeks)
**Goal:** Make DIARY tokens valuable

**Features:**
- Enhanced food system (5 types: Free → 50 DIARY)
- Mini-games with skill-based rewards (10-30 DIARY)
- Consumable items (Time Skip, Health Potion, Mutation Serum)

**Impact:**
- ✅ Tokens have real value
- ✅ Strategic resource management
- ✅ Gameplay variety
- ✅ Power-user token sink

---

#### **Phase 2: Discovery & Personality** (3-4 weeks)
**Goal:** Create personal connection with pet

**Features:**
- Secret combinations (3 unique per wallet hash)
  - Example: "Write at 3am" → Night Owl badge + 25 DIARY
  - Discovery hints after 30/50/100 days
  - Cannot be googled (personalized!)
- Pet personality traits (randomized at birth)
  - Favorite food, sleep schedule, energy level
  - Affects animations and bonuses
- Food preferences (favorite foods = 2x effect)

**Impact:**
- ✅ Personal emotional connection
- ✅ Discovery gameplay
- ✅ Replay value through experimentation
- ✅ Viral potential (sharing hints without spoilers)

---

#### **Phase 3: Social & Evolution** (1-2 months)
**Goal:** Long-term engagement and community

**Features:**
- Generation system (Baby → Teen → Adult → Elder)
  - Evolution triggers based on entries + happiness
  - Each generation unlocks new abilities
  - Max lifespan: 100 days
- Breeding mechanics (requires 2 Adult users)
  - Offspring inherits traits from both parents
  - Rarity system: Common → Legendary
  - Cost: 200 DIARY per user
- Pet registry & leaderboards
  - Public stats: Longest streak, rarest pets
  - Pet shows with community voting
- Optional NFT integration
  - Mint pet as NFT: 500 DIARY
  - Tradeable, provable ownership
  - On-chain rarity/breeding history

**Impact:**
- ✅ Death becomes progression (not loss)
- ✅ 90+ day retention goal
- ✅ Social connections through breeding
- ✅ Marketplace value for rare pets

---

#### **Phase 4: Advanced Features** (3+ months)
**Goal:** Community platform

**Features:**
- Pet competitions & shows (weekly)
- AI sentiment analysis bonuses
  - Positive mood → +15 happiness
  - Deep reflection (500+ words) → learn new trick
  - Weekly summary unlocks personality insights
- Seasonal events (Halloween, Christmas, etc.)
- Guild system with collaborative quests

**Impact:**
- ✅ Social motivation (flexing)
- ✅ Rewards meaningful journaling (not spam)
- ✅ Community engagement
- ✅ Long-term retention

---

### 💰 Value Proposition

#### **Emotional Value**
- Pet reflects your personal journaling journey
- Generations create legacy (not just death)
- Secret combos tell your unique story
- Breeding builds social connections

#### **Financial Value** (with NFT)
- Rare pets become tradeable assets
- Elder Gen 3 pets earn breeding income (50 DIARY per breed)
- Limited event items gain collectible value
- Proof of consistency (100d streak = valuable pet)

#### **Utility Value**
- AI summary provides actual journaling insights
- Mood tracking through pet behavior analysis
- Habit formation through gamification
- Community support through guilds

---

### ✨ Key Differentiators

**vs Habitica:** Pets actually evolve and breed
**vs Duolingo:** AI-powered emotional insights from entries
**vs Axie Infinity:** Journaling creates value (not mindless grinding)
**vs Generic Tamagotchi:** Secret combos unique per user (impossible to copy)
**vs Day One:** Gamification with social and financial value

---

## 🎮 Prototype Phase (CURRENT)

### Core Mechanics

**Lives System**
- **Starting Health**: 7/7 lives
- **Grace Period**: 24 hours without penalty
- **Life Loss**: -1 life every 24 hours after grace period
- **Life Gain**:
  - Write entry: +2 lives
  - Feed pet: +1 life (8h cooldown)
- **Death State**: 0 lives = critical state, pet dies

**Happiness System**
- **Starting Happiness**: 100%
- **Decay**: -1% every 2 hours of inactivity
- **Happiness Gain**:
  - Play with pet: +10 happiness (4h cooldown)
- **Max**: 100%

**Token Economy**
- **Earn DIARY Tokens**:
  - First entry: 50 DIARY (affected by multiplier)
  - Daily entry: 10 DIARY (affected by multiplier)
  - Streak bonuses: 7d/30d/100d (affected by multiplier)
- **Spend DIARY Tokens**:
  - Shop items: 50-100 DIARY
  - Weekly summary: 50 DIARY

**Reward Multiplier System** (NEW!)
- **Perfect (1.0x)**: happiness ≥70%, lives ≥5 → Full rewards
- **Good (0.8x)**: happiness ≥50%, lives ≥3 → 80% rewards
- **Poor (0.5x)**: happiness <50% OR lives <3 → 50% rewards
- **Critical (0.25x)**: lives ≤1 → 25% rewards (pet dying!)
- Example: Daily 10 DIARY becomes 2.5 DIARY when critical

**Pet States** (Animation-based)
```
Priority 1: eating/playing (action states)
Priority 2: critical (0 lives)
Priority 3: playing (when music ON)
Priority 4: sleeping (12h+ inactive)
Priority 5: happy (happiness ≥70, lives ≥5)
Priority 6: sad (happiness <30 OR lives ≤2)
Priority 7: idle (default)
```

**Available Items**
- Backgrounds (50-100 DIARY)
- Pet accessories (future)
- **Food items** (0-50 DIARY):
  - Basic Kibble: FREE (+1♥)
  - Premium Meat: 20 DIARY (+1♥ +10☺)
  - Veggie Bowl: 15 DIARY (+1♥ +20☺)
  - Energy Drink: 50 DIARY (+2♥ +30☺)
- **Consumables** (50-150 DIARY):
  - Time Skip Potion: 100 DIARY (reset cooldowns)
  - Health Potion: 150 DIARY (+3 lives)
  - Happy Pill: 50 DIARY (+30 happiness)

**Pet Personality System** (NEW!)
- Each pet gets random traits at creation:
  - Energy Level: Lazy / Normal / Hyper
  - Favorite Food: Meat / Veggie / Kibble / Energy
  - Sleep Schedule: Morning / Afternoon / Night
- Traits affect gameplay:
  - Hyper pets: +5 happiness from play (15 total)
  - Lazy pets: +5 happiness from play (5 total)
  - Favorite food: 2x effect (e.g., 20 DIARY food → 40 happiness if favorite)

### Limitations
- ❌ No pet evolution
- ❌ No breeding
- ✅ ~~No food variety~~ → **DONE! 4 food types**
- ✅ ~~No personality~~ → **DONE! Random traits per wallet**
- ❌ Single pet per user
- ❌ No mini-games
- ❌ No secret combinations

### ✅ Recently Added
- ✅ Happiness decay system (-1% every 2h)
- ✅ Reward multipliers based on pet condition
- ✅ Streak bonuses affected by multiplier
- ✅ Visual feedback for pet condition
- ✅ **Enhanced food system** (4 food types: Free → 50 DIARY)
- ✅ **Pet personality traits** (energyLevel, favoriteFood, sleepSchedule)
- ✅ **Favorite food bonus** (2x effect when feeding favorite)
- ✅ **Consumable items** (Time Skip, Health Potion, Happy Pill)
- ✅ **Inventory system** for consumable items

---

## 🚀 Alpha Phase - Enhanced Mechanics

### 1. Happiness Decay System

**Natural Decay**
```
Base decay: -2 happiness per 6 hours
Accelerated decay: -5 happiness per 6 hours (if lives ≤2)
Minimum: 0%
```

**Impact on Pet**
```
Happiness < 20%: Pet refuses to play (cooldown ignored)
Happiness = 0%: -1 life per day (stacks with inactivity)
```

**Recovery**
- Play action: +10 happiness
- Feed action: +5 happiness (bonus)
- Write entry: +15 happiness (new)
- Special food items: +20-30 happiness

---

### 2. Enhanced Food System

**Food Types & Effects**

| Food Item | Cost | Effect | Cooldown | Animation |
|-----------|------|--------|----------|-----------|
| **Basic Kibble** | Free | +1♥ | 8h | eating (neutral) |
| **Premium Meat** | 20 DIARY | +1♥, +10☺ | 6h | eating (happy bounce) |
| **Fish Sushi** | 30 DIARY | +2♥ | 8h | eating (sparkles) |
| **Veggie Bowl** | 15 DIARY | +1♥, +20☺ | 6h | eating (green glow) |
| **Treat Cookie** | 25 DIARY | +30☺ | 4h | eating (hearts) |
| **Energy Drink** | 50 DIARY | Full♥, +50☺ | 24h | eating (lightning) |

**Food Preferences (Per Pet)**
- Each pet has 1-2 "favorite foods" (hidden at first)
- Feeding favorite food: **2x effect**
- Discovery: User notices bigger response
- Hint system: After 5 feedings, show preferences

**Feeding Animations**
```
Basic: Simple eating (1.5s)
Premium: Happy eating with bounce (2s)
Favorite: Excited eating with hearts + sparkles (2.5s)
Disliked: Reluctant eating, no bonus (1s)
```

---

### 3. Mini-Games System

**Play Actions Expanded**

| Game | Cost | Effect | Duration | Skill |
|------|------|--------|----------|-------|
| **Ball Fetch** | Free | +10☺ | 4h CD | None |
| **Hide & Seek** | 10 DIARY | +15☺ | 3h CD | Timing |
| **Puzzle Toy** | 20 DIARY | +20☺, +10 DIARY bonus | 2h CD | Memory |
| **Dance Party** | 30 DIARY | +25☺, music sync | 4h CD | Rhythm |
| **Training Session** | 40 DIARY | +10☺, +XP | 6h CD | Strategy |

**Mini-Game Mechanics**

**Hide & Seek**
```
3 locations shown: tree, box, bush
Pet hides behind one
User has 3 guesses
Correct guess: +5 bonus DIARY
Time limit: 10 seconds
```

**Puzzle Toy**
```
4x4 grid of tiles
Match pet's pattern
3 levels of difficulty
Complete all: +10 DIARY bonus
Failure: still get base happiness
```

**Dance Party**
```
Music plays from PawPlayer
Pet dances (playing animation)
User clicks on-beat
Perfect rhythm: +10 DIARY bonus
Miss beats: reduced happiness gain
```

**Training Session**
```
Teach pet a trick
Success: pet performs trick animation
Adds to pet's "Trick List"
Tricks can be replayed anytime
Unlocks: Sit, Roll, Jump, Spin
```

---

### 4. Secret Combination System

**Personal Mystery Actions**

**How It Works**
- Each user gets 3 unique secret combinations
- Combinations are personalized (based on wallet address hash)
- Discovery: User stumbles upon them naturally
- Reward: Bonus DIARY tokens + special animation

**Example Combinations**

```typescript
// User A's secrets (hashed from wallet)
Secret #1: Feed → Wait 1h → Play → Feed
  Reward: +50 DIARY, "Super Combo!" animation

Secret #2: Write entry at 3am
  Reward: +25 DIARY, "Night Owl" badge

Secret #3: Play 3 times in 1 hour (using items)
  Reward: +30 DIARY, pet evolves faster
```

**Discovery Hints**
```
After 30 days: "Try feeding twice in a row..."
After 50 days: "Your pet seems energetic at night..."
After 100 days: "Experiment with play patterns..."
```

**What if user changes?**
- Secrets are wallet-based, not device-based
- New device = same secrets (preserved)
- This encourages consistency
- BUT: If user sells/transfers pet (future), secrets reset

**Community Aspect**
- Users can't share exact combinations (they're unique)
- But can share hints: "Try playing more often!"
- Creates mystery and experimentation culture

---

### 5. Pet Personality System

**Personality Traits** (Generated at birth)

```typescript
interface PetPersonality {
  favoriteFood: 'meat' | 'fish' | 'veggie';
  favoriteToy: 'ball' | 'puzzle' | 'dance';
  sleepSchedule: 'morning' | 'night' | 'afternoon';
  energyLevel: 'lazy' | 'normal' | 'hyper';
  socialness: 'shy' | 'friendly' | 'extrovert';
}
```

**Personality Effects**

**Lazy Pet**
- Sleep animation more often
- -5 happiness when played with too frequently
- +5 happiness when left idle for 12h

**Hyper Pet**
- Requires play every 6 hours (vs 4h cooldown)
- -10 happiness if not played with for 12h
- +15 happiness from play (vs +10)

**Shy Pet**
- Prefers solo activities (feeding, writing)
- -5 happiness from dance party
- +20 happiness from puzzle toy

**Friendly Pet**
- Normal decay rate
- Balanced preferences
- Easy to care for

**Morning Bird**
- Most active 6am-12pm
- Actions during morning: +5 bonus happiness
- Actions at night: -2 happiness penalty

**Night Owl**
- Most active 8pm-2am
- Secret combos easier to discover at night
- Sleep animation during day

---

## 🧬 Beta Phase - Breeding & Generations

### 1. Pet Evolution & Lifespan

**Generation System**

**Gen 0 (Birth)**
```
Starting state: Baby
Age: 0 days
Max lifespan: 100 days
Stats: Lives 7, Happiness 100
Personality: Randomized
```

**Gen 1 (Evolution)**
```
Age: 30 days
Condition: Must maintain >50% happiness + write 20 entries
Evolution: Baby → Teen
New animations: Bigger sprite, new tricks
Stats bonus: Max lives +1 (8 lives total)
```

**Gen 2 (Adult)**
```
Age: 60 days
Condition: Must maintain >70% happiness + 50 entries
Evolution: Teen → Adult
New animations: Mature sprite, advanced tricks
Stats bonus: Max lives +1 (9 lives total)
Unlocks: Breeding capability
```

**Gen 3 (Elder)**
```
Age: 90 days
Condition: Survive to 90 days + 100 entries
Evolution: Adult → Elder
New animations: Wise sprite, special aura
Stats bonus: Passive happiness +5/day
Unlocks: Rare breeding outcomes
```

**Death & Rebirth**
```
Lifespan ends: Pet enters "Spirit Form"
Spirit pet: Read-only, shows stats/history
Option 1: Keep spirit pet as memorial
Option 2: Breed spirit pet → New Gen 0
Option 3: Start fresh Gen 0
```

---

### 2. Breeding System

**Requirements**
- 2 Adult pets (Gen 2+)
- Both owners agree
- Cost: 200 DIARY per owner
- Cooldown: 7 days

**Breeding Mechanics**

**Step 1: Match Making**
```
User A: "Looking for breeding partner (Cat, Elder)"
User B: "Accept breeding request"
Both pay 200 DIARY
```

**Step 2: Genetic Combination**
```typescript
// Offspring inherits traits
const offspring = {
  species: random(parent1.species, parent2.species),
  personality: merge(parent1.personality, parent2.personality),
  favoriteFood: weighted(parent1.favoriteFood, parent2.favoriteFood),
  secretCombos: generateNew(parent1.wallet, parent2.wallet),
  rarity: calculateRarity(parent1, parent2),
};
```

**Rarity System**
```
Common: 70% chance (normal colors)
Uncommon: 20% chance (special colors)
Rare: 8% chance (unique patterns)
Legendary: 2% chance (animated effects)
```

**Step 3: Hatching**
```
Egg appears in both users' accounts
Hatch time: 48 hours
Hatch actions: Both users must write 1 entry
Reward: New Gen 0 pet with combined traits
```

**Breeding Outcomes**

**Common Breeding** (Adult + Adult)
```
Parents: Both Gen 2
Offspring: Gen 0 with 1 trait from each parent
Rarity: 90% common, 10% uncommon
```

**Rare Breeding** (Elder + Elder)
```
Parents: Both Gen 3
Offspring: Gen 0 with 2 traits from each parent
Rarity: 50% common, 30% uncommon, 15% rare, 5% legendary
```

**Legendary Traits**
- Glowing aura
- Rainbow colors
- Sparkle effect
- Unique animations
- +20% bonus on all actions
- Exclusive secret combos

---

### 3. Pet Registry & Marketplace

**Pet NFT System** (Optional on-chain)
- Each pet can be minted as NFT
- Cost: 500 DIARY
- Benefits: Tradeable, provable ownership, on-chain history
- Stats stored: Generation, traits, rarity, breeding count

**Marketplace**
```
List pet for sale: Min 1000 DIARY
Trade pets: Direct swap
Rent pet for breeding: 100 DIARY per breeding
Leaderboard: Most valuable pets
```

**Pet Stud Service**
- Elder pets can be "stud pets"
- Other users pay to breed with them
- Owner earns 50 DIARY per breeding
- Max 10 breedings per pet

---

### 4. Generation Abilities

**Gen-Specific Powers**

**Gen 0 Powers**
- None (learning phase)

**Gen 1 Powers (Teen)**
- **Quick Learner**: -1h on all cooldowns
- **Energetic**: +5 happiness from play

**Gen 2 Powers (Adult)**
- **Wise**: +20% DIARY from entries
- **Breeder**: Can breed with others
- **Efficient**: Food effects last +2h

**Gen 3 Powers (Elder)**
- **Mentor**: Passive +5 happiness per day
- **Master**: Teach tricks to Gen 0 pets
- **Legendary Breeder**: Higher rare offspring chance

---

## 🔮 Future Phases - Advanced Features

### 1. Social Features

**Pet Playdates**
```
2 users meet → pets interact
Both pets: +20 happiness
Unlocks: Shared animations
Friendship level: Builds over time
```

**Pet Shows**
```
Weekly competition
Categories: Cutest, Happiest, Best Tricks
Voting: Community votes with 10 DIARY
Winners: 500 DIARY + exclusive item
```

**Guild System**
```
Create/join pet guilds
Guild bonuses: +5% DIARY, shared resources
Guild quests: Collaborative goals
Guild pets: Shared virtual pet
```

---

### 2. Advanced Items

**Wearables**
```
Hats: 50 DIARY (cosmetic)
Glasses: 75 DIARY (cosmetic + personality change)
Collars: 100 DIARY (+1 max lives)
Wings: 200 DIARY (flight animation)
```

**Environments**
```
Home upgrades: 200-500 DIARY
Garden: Pet plays outside
Pool: Swim animation
Playground: New mini-games
```

**Consumables**
```
Health Potion: 100 DIARY (restore full lives)
Happy Pill: 50 DIARY (+50 happiness instant)
Time Skip: 150 DIARY (skip 4h cooldown)
Mutation Serum: 500 DIARY (reroll personality)
```

---

### 3. Seasonal Events

**Holiday Events**
```
Halloween: Spooky pets, candy items
Christmas: Santa hat, snow environment
Valentine's: Love animations, breeding discount
Easter: Egg hunt mini-game
```

**Limited Items**
```
Available only during event
Higher rarity than normal
Cosmetic + stat bonuses
Collectible value
```

---

### 4. Achievement System

**Badges**
```
"First Steps": Write 1 entry
"Dedicated": 7-day streak
"Master": 100-day streak
"Breeder": Breed 5 offspring
"Collector": Own 3 pets
"Secret Master": Find all 3 combos
```

**Profile Showcase**
```
Display badges
Show rarest pets
Breeding history
Total DIARY earned
```

---

## 📊 Roadmap Timeline

### Q1 2025 - Prototype → Alpha
- ✅ Prototype complete (current state)
- ⏳ Happiness decay system
- ⏳ Enhanced food system
- ⏳ Mini-games (2-3)
- ⏳ Secret combinations (basic)

### Q2 2025 - Alpha → Beta
- Pet personality system
- Generation system (Gen 0 → Gen 1)
- Evolution animations
- More mini-games (5 total)
- Pet preferences discovery

### Q3 2025 - Beta Features
- Breeding system
- Generation 2-3
- Pet registry
- NFT integration (optional)
- Marketplace

### Q4 2025 - Advanced Features
- Social features
- Advanced items
- Seasonal events
- Achievement system
- Guild system

---

## 🎯 Design Philosophy

### Core Principles

1. **Journaling First**: Pet is motivation, not distraction
2. **No Pay-to-Win**: All items earnable through journaling
3. **Emotional Connection**: Pet reflects user's journaling habits
4. **Discovery**: Secret combos create "aha!" moments
5. **Community**: Breeding and social features build connections
6. **Longevity**: Generations create long-term engagement

### Balance Considerations

**Avoid**
- ❌ Too much grinding (cooldowns respect user time)
- ❌ Predatory mechanics (no loot boxes, no RNG paywalls)
- ❌ Death anxiety (pet death is evolution, not loss)
- ❌ FOMO pressure (events return, limited items become classic)

**Encourage**
- ✅ Daily journaling (core loop)
- ✅ Experimentation (secret combos)
- ✅ Community (breeding, playdates)
- ✅ Creativity (pet customization)
- ✅ Long-term play (generations)

---

## 🔧 Technical Implementation Notes

### Alpha Phase - Required Changes

**Database Schema Additions**
```prisma
model User {
  // New fields
  petPersonality  Json?       // {favoriteFood, favoriteToy, etc}
  secretCombos    Json?       // {combo1, combo2, combo3, discovered}
  happinessDecayRate Int     @default(2) // Per 6 hours
  lastHappinessDecay DateTime?
}

model FoodItem {
  id          String @id
  name        String
  cost        Int
  livesGain   Int
  happinessGain Int
  cooldown    Int    // Hours
  animation   String
  rarity      String
}

model MiniGame {
  id          String @id
  name        String
  cost        Int
  happinessGain Int
  cooldown    Int
  difficulty  String
  skillType   String
}
```

### Beta Phase - Required Changes

**Generation System**
```prisma
model Pet {
  id          String @id @default(cuid())
  userId      String
  generation  Int    @default(0) // 0=baby, 1=teen, 2=adult, 3=elder
  age         Int    @default(0) // Days
  birthDate   DateTime @default(now())
  parent1Id   String?
  parent2Id   String?
  rarity      String @default("common")
  traits      Json   // Inherited traits
  breedCount  Int    @default(0)
  isNFT       Boolean @default(false)
  nftTokenId  String?
}

model BreedingRequest {
  id          String @id
  pet1Id      String
  pet2Id      String
  status      String // pending, accepted, completed
  eggId       String?
  createdAt   DateTime
}
```

---

**Version**: 1.0
**Last Updated**: January 2025
**Status**: Living Document - Updates as features ship
