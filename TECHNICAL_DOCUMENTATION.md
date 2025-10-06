# Technical Documentation - DiaryBeast Alpha v0.1

## Table of Contents
1. [Technology Stack](#technology-stack)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema](#database-schema)
4. [API Specification](#api-specification)
5. [Smart Contract Specification](#smart-contract-specification)
6. [Encryption & Security](#encryption--security)
7. [Deployment & Infrastructure](#deployment--infrastructure)
8. [Development Setup](#development-setup)

---

## Technology Stack

### Frontend
```json
{
  "framework": "Next.js 14+ (App Router)",
  "language": "TypeScript 5+",
  "styling": "Tailwind CSS 3",
  "state": "React Hooks + Zustand (optional)",
  "ui": "Vanilla components (no heavy libraries)"
}
```

### Web3
```json
{
  "blockchain": "Base (Sepolia for dev)",
  "wallet": "Coinbase Smart Wallet (Base Account)",
  "libraries": [
    "@coinbase/onchainkit",
    "wagmi ^2.0",
    "viem ^2.0"
  ],
  "contracts": "Solidity 0.8.20 + OpenZeppelin"
}
```

### Backend
```json
{
  "runtime": "Next.js API Routes (serverless)",
  "database": "PostgreSQL (Vercel Postgres)",
  "orm": "Prisma 5+",
  "auth": "Wallet signature verification"
}
```

### Infrastructure
```json
{
  "hosting": "Vercel",
  "cicd": "GitHub Actions (auto-deploy on push)",
  "monitoring": "Vercel Analytics (basic)"
}
```

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Client (Browser)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js App (React Components)                  │   │
│  │  - Wallet Provider (OnchainKit)                  │   │
│  │  - State Management (Zustand)                    │   │
│  │  - Client-side Encryption (ethers.js)           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            │
                  HTTPS (REST API)
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes (Serverless)            │
│  /api/auth/verify   - Wallet signature verification     │
│  /api/entries       - CRUD operations                    │
│  /api/shop/items    - List shop items                    │
│  /api/shop/purchase - Token burn + purchase              │
│  /api/progress      - User stats                         │
└─────────────────────────────────────────────────────────┘
                    │                │
        ┌───────────┘                └───────────┐
        ▼                                        ▼
┌──────────────────┐                   ┌──────────────────┐
│  PostgreSQL      │                   │  Base Blockchain │
│  (Vercel)        │                   │  (Sepolia)       │
│  - Users         │                   │  - DiaryToken    │
│  - Entries       │                   │    (ERC20)       │
│  - Purchases     │                   │  - Mint/Burn     │
│  - Rewards       │                   │    Operations    │
└──────────────────┘                   └──────────────────┘
```

### Request Flow: Create Entry

```
1. User writes entry in browser
   ↓
2. Client encrypts content with wallet signature
   contentHash = keccak256(plaintext)
   encryptedContent = encrypt(plaintext, walletDerivedKey)
   ↓
3. User signs contentHash with wallet
   signature = wallet.signMessage(contentHash)
   ↓
4. POST /api/entries
   Body: { encryptedContent, signature, contentHash }
   ↓
5. Backend verifies signature
   recoveredAddress = ecrecover(contentHash, signature)
   assert(recoveredAddress === userAddress)
   ↓
6. Save to database
   Entry.create({ userId, encryptedContent, signature, ... })
   ↓
7. Mint tokens on-chain
   DiaryToken.mintReward(userAddress, 10 * 10^18)
   ↓
8. Update user state
   User.update({ coinsBalance, currentStreak, lastEntryDate })
   ↓
9. Return success + tx hash
   { success: true, txHash: "0x...", coinsEarned: 10 }
```

---

## Database Schema

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(cuid())
  walletAddress     String    @unique
  selectedAnimal    String?   // 'cat' | 'dog'
  coinsBalance      Int       @default(0)
  livesRemaining    Int       @default(7)
  currentStreak     Int       @default(0)
  longestStreak     Int       @default(0)
  lastEntryDate     DateTime?
  lastActiveAt      DateTime  @default(now()) // For life loss tracking
  lastLifeLossCheck DateTime  @default(now()) // Rate limiting for checks
  aiAnalysisEnabled Boolean   @default(false)
  activeBackground  String?
  activeAccessory   String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  entries         Entry[]
  purchases       Purchase[]
  rewards         Reward[]

  @@index([walletAddress])
}

model Entry {
  id                String   @id @default(cuid())
  userId            String
  encryptedContent  String   @db.Text
  signature         String
  contentHash       String
  wordCount         Int      @default(0)
  date              DateTime @default(now())
  createdAt         DateTime @default(now())

  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date(sort: Desc)])
  @@index([userId])
  @@index([date])
}

model Purchase {
  id          String   @id @default(cuid())
  userId      String
  itemType    String   // 'background'
  itemId      String
  price       Int
  txHash      String?  // Blockchain transaction hash
  purchasedAt DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Reward {
  id          String   @id @default(cuid())
  userId      String
  type        String   // 'daily_entry' | 'first_entry' | 'week_streak'
  amount      Int
  description String
  txHash      String   // Token mint transaction hash
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model ShopItem {
  id          String  @id @default(cuid())
  type        String  // 'background'
  name        String
  description String?
  price       Int
  imageUrl    String
  available   Boolean @default(true)
  sortOrder   Int     @default(0)

  @@index([type, available])
}
```

### Sample Data

```sql
-- Shop Items (seed data)
INSERT INTO "ShopItem" (id, type, name, price, imageUrl, available, sortOrder)
VALUES
  ('default-bg', 'background', 'Default', 0, '/backgrounds/default.jpg', true, 0),
  ('sunset-bg', 'background', 'Sunset', 50, '/backgrounds/sunset.jpg', true, 1),
  ('night-bg', 'background', 'Night Sky', 100, '/backgrounds/night.jpg', true, 2);
```

---

## API Specification

### Base URL
```
Development: http://localhost:3000/api
Production: https://diarybeast.app/api
```

### Authentication
All authenticated endpoints require:
```typescript
Headers: {
  'x-wallet-address': '0x...',
  'x-signature': '0x...',
  'x-message': 'Authenticate to DiaryBeast'
}
```

---

### Endpoints

#### **POST /api/auth/verify**
Verify wallet ownership and create/login user.

**Request:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "message": "Authenticate to DiaryBeast",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "clu123...",
    "walletAddress": "0x742d35...",
    "selectedAnimal": null,
    "coinsBalance": 0,
    "currentStreak": 0
  },
  "isNewUser": true
}
```

**Errors:**
- `400`: Invalid signature
- `500`: Server error

---

#### **GET /api/user/:address**
Get user profile and stats.

**Response:**
```json
{
  "id": "clu123...",
  "walletAddress": "0x742d35...",
  "selectedAnimal": "cat",
  "coinsBalance": 120,
  "livesRemaining": 7,
  "currentStreak": 5,
  "longestStreak": 12,
  "lastEntryDate": "2025-10-06T10:30:00Z",
  "totalEntries": 45
}
```

---

#### **PATCH /api/user/:address**
Update user settings (onboarding).

**Request:**
```json
{
  "selectedAnimal": "cat"
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* updated user */ }
}
```

---

#### **POST /api/entries**
Create a new diary entry.

**Request:**
```json
{
  "encryptedContent": "U2FsdGVkX1...",
  "signature": "0x...",
  "contentHash": "0xabcd1234...",
  "wordCount": 342
}
```

**Response:**
```json
{
  "success": true,
  "entry": {
    "id": "entry123",
    "date": "2025-10-06T10:30:00Z"
  },
  "reward": {
    "amount": 10,
    "type": "daily_entry",
    "txHash": "0x..."
  },
  "updatedUser": {
    "coinsBalance": 130,
    "currentStreak": 6,
    "livesRemaining": 7
  }
}
```

**Errors:**
- `409`: Entry already exists for today
- `400`: Invalid signature
- `500`: Token mint failed

---

#### **GET /api/entries**
Get user's entries (paginated).

**Query Params:**
- `limit` (default: 20)
- `offset` (default: 0)

**Response:**
```json
{
  "entries": [
    {
      "id": "entry123",
      "encryptedContent": "U2FsdGVkX1...",
      "signature": "0x...",
      "contentHash": "0xabcd...",
      "date": "2025-10-06T10:30:00Z",
      "wordCount": 342
    }
  ],
  "total": 45,
  "hasMore": true
}
```

---

#### **GET /api/shop/items**
List all shop items.

**Response:**
```json
{
  "items": [
    {
      "id": "sunset-bg",
      "type": "background",
      "name": "Sunset",
      "description": "Warm sunset colors",
      "price": 50,
      "imageUrl": "/backgrounds/sunset.jpg"
    }
  ]
}
```

---

#### **POST /api/shop/purchase**
Purchase an item with tokens.

**Request:**
```json
{
  "itemId": "sunset-bg"
}
```

**Response:**
```json
{
  "success": true,
  "purchase": {
    "id": "purchase123",
    "itemId": "sunset-bg",
    "price": 50,
    "txHash": "0x..."
  },
  "updatedBalance": 70
}
```

**Errors:**
- `400`: Insufficient tokens
- `409`: Item already owned
- `500`: Burn transaction failed

---

#### **GET /api/shop/purchases**
Get user's purchased items.

**Response:**
```json
{
  "purchases": [
    {
      "id": "purchase123",
      "itemType": "background",
      "itemId": "sunset-bg",
      "purchasedAt": "2025-10-05T14:20:00Z"
    }
  ]
}
```

---

## Smart Contract Specification

### Contract: DiaryToken

**Network:** Base Sepolia (chainId: 84532)
**Language:** Solidity 0.8.20
**Standard:** ERC20 (with transfer restrictions)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiaryToken is ERC20, Ownable {
    constructor() ERC20("DiaryToken", "DIARY") Ownable(msg.sender) {}

    // Mint tokens as reward (only backend wallet)
    function mintReward(address user, uint256 amount) external onlyOwner {
        _mint(user, amount);
    }

    // Burn tokens (anyone can burn their own)
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Burn tokens from user (for purchases, only owner)
    function burnFrom(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }

    // Override to prevent transfers (soul-bound)
    function transfer(address, uint256) public pure override returns (bool) {
        revert("DiaryToken: transfers are disabled");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("DiaryToken: transfers are disabled");
    }

    function approve(address, uint256) public pure override returns (bool) {
        revert("DiaryToken: approvals are disabled");
    }
}
```

### Deployment Script

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const DiaryToken = await ethers.getContractFactory("DiaryToken");
  const diaryToken = await DiaryToken.deploy();
  await diaryToken.waitForDeployment();

  const address = await diaryToken.getAddress();
  console.log("DiaryToken deployed to:", address);

  // Verify on Basescan
  if (process.env.NODE_ENV === "production") {
    console.log("Verifying contract...");
    await run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

### Token Economics

| Action | Tokens | Notes |
|--------|--------|-------|
| First entry | +50 DIARY | One-time bonus |
| Daily entry | +10 DIARY | Max 1/day |
| 7-day streak | +100 DIARY | Weekly bonus |
| Background (basic) | -50 DIARY | Burned on purchase |
| Background (premium) | -100 DIARY | Burned on purchase |

**Decimals:** 18 (standard ERC20)
**Supply:** Unlimited (minted on demand)
**Transferable:** No (soul-bound)

---

## Life Loss System (Gamification)

### Overview

The Life Loss System is a core gamification mechanic that creates emotional engagement by making the user's virtual pet lose "lives" when inactive. This encourages regular app usage and creates stakes for the journaling habit.

### Core Mechanics

**Grace Period:** 24 hours without penalty after last activity
**Life Loss Rate:** 1 life per 24 hours after grace period
**Maximum Lives:** 7 (full health)
**Life Restoration:** +2 lives per diary entry (not full restore)
**Midnight Crossing:** Session expiration logic checks day boundaries

### Business Logic

```typescript
// Life loss formula
hoursInactive = now - lastActiveAt
hoursAfterGrace = hoursInactive - 24
livesToLose = floor(hoursAfterGrace / 24)
newLives = max(0, currentLives - livesToLose)

// Examples:
// 23 hours: 0 lives lost (grace period)
// 48 hours: 1 life lost
// 72 hours: 2 lives lost
// 8 days: 7 lives lost (all)
```

### Pet States

| Lives | State | Emoji (Cat/Dog) | Animation | Health Status |
|-------|-------|-----------------|-----------|---------------|
| 4-7 | Happy | 😺 / 🐶 | Bounce | Healthy |
| 1-3 | Sad | 😿 / 🐕‍🦺 | None | Needs Care |
| 0 | Critical | 🙀 / 😵 | Pulse | Critical |

### API Endpoints

#### **POST /api/life/check**

Check and update pet lives based on inactivity.

**Request:**
```json
{
  "userAddress": "0x742d35..."
}
```

**Response:**
```json
{
  "livesLost": 2,
  "newLives": 5,
  "streakReset": false,
  "shouldNotify": true,
  "notificationType": "warning",
  "message": "Your pet missed you! Lost 2 lives",
  "hoursInactive": 55.5
}
```

**Logic:**
1. Check if >1 hour since last full check (rate limiting)
2. If not, just update `lastActiveAt` and return
3. If yes, calculate life loss with grace period
4. If 0 lives → reset `currentStreak`, update `longestStreak`
5. Update DB: `livesRemaining`, `lastLifeLossCheck`, `lastActiveAt`
6. Return notification data

### Client-Side Hook

**useLifeCheck()** - Automatic life checking with:
- Auto-check on component mount (login/page load)
- Check on route change
- Interval check every 1 minute for midnight crossing
- Debounced (30 seconds minimum between checks)
- Returns notification state for UI

```typescript
const { notification, clearNotification } = useLifeCheck();

// notification structure:
{
  livesLost: number,
  newLives: number,
  streakReset: boolean,
  notificationType: 'warning' | 'critical' | null,
  message: string,
  hoursInactive: number
}
```

### UI Components

**1. LifeLossNotification (Toast)**
- Yellow/orange warning: Lost 1-3 lives
- Red critical: Lost 4+ lives or down to 0-1 lives
- Shows heart icons (before/after)
- Auto-dismisses after 5 seconds

**2. CriticalLifeModal**
- Blocks UI when lives = 0
- Shows days inactive
- Shows streak reset information
- "Write Now" button → redirects to /diary

**3. EntrySuccessModal**
- Celebration with confetti animation
- Shows tokens earned
- Shows lives restored (+2)
- Before/after lives display
- Auto-closes after 5 seconds

**4. Pet Component Updates**
- Critical state support (🙀/😵)
- Health status label (Healthy/Needs Care/Critical)
- Pulse animation for critical
- Broken hearts (💔) when lives = 0

**5. RightSidebar Updates**
- "Last active: X ago" display
- Uses `formatLastActive()` helper

### Midnight Session Expiration

The system checks for midnight crossing to enforce daily engagement:

```typescript
function didCrossMidnight(lastActiveAt: Date): boolean {
  const now = new Date();
  const lastDate = new Date(lastActiveAt).setHours(0, 0, 0, 0);
  const nowDate = new Date(now).setHours(0, 0, 0, 0);
  return nowDate > lastDate;
}
```

**Example:**
- User active: Jan 1, 23:30
- Current time: Jan 2, 00:30
- Result: Midnight crossed (true)
- Action: Trigger life check even though <24 hours passed

This ensures users can't "game" the system by logging in just before midnight.

### Entry Submission Updates

When user writes diary entry:

```typescript
// 1. Calculate lives to restore
const newLives = restoreLives(currentLives); // +2, max 7

// 2. Update user
await prisma.user.update({
  data: {
    livesRemaining: newLives,
    lastActiveAt: now,
    lastEntryDate: now,
    currentStreak: { increment: 1 },
    coinsBalance: { increment: rewardAmount },
  }
});

// 3. Return for UI
{
  livesRestored: newLives - currentLives,
  oldLives: currentLives,
  newLives: newLives,
}
```

### Core Functions (lib/gamification/lifeSystem.ts)

```typescript
// Calculate life loss
calculateLifeLoss(lastActiveAt, currentLives): LifeLossResult

// Check if enough time passed for full check
shouldCheckLifeLoss(lastLifeLossCheck): boolean

// Restore lives (+2, max 7)
restoreLives(currentLives): number

// Get pet emotional state
getPetState(livesRemaining): 'happy' | 'sad' | 'critical'

// Format time for display
formatLastActive(date): string // "2 hours ago", "3 days ago"

// Check midnight crossing
didCrossMidnight(lastActiveAt): boolean
```

### Database Fields

**User model additions:**
- `lastActiveAt`: DateTime - Updated on any user interaction
- `lastLifeLossCheck`: DateTime - Rate limits full life checks (1 hour minimum)

### Integration Points

**1. App Layout (providers.tsx)**
```tsx
<LifeCheckWrapper>
  {children}
</LifeCheckWrapper>
```

**2. Diary Page (app/diary/page.tsx)**
```tsx
// Show success modal after entry save
<EntrySuccessModal
  isOpen={showSuccessModal}
  tokensEarned={data.reward.amount}
  livesRestored={data.livesRestored}
  oldLives={data.oldLives}
  newLives={data.newLives}
  onClose={() => setShowSuccessModal(false)}
/>
```

### Testing Scenarios

1. ✅ User active, no life loss (< 24h)
2. ✅ 48h inactive → lose 1 life
3. ✅ 8 days inactive → lose all 7 lives
4. ✅ 0 lives → streak resets
5. ✅ Write entry → +2 lives (not full restore)
6. ✅ Midnight crossing detected
7. ✅ Toast shown for warnings (1-3 lives lost)
8. ✅ Modal shown for critical (0 lives)
9. ✅ Confetti on entry save
10. ✅ Pet emoji changes correctly
11. ✅ Rate limiting prevents spam checks
12. ✅ "Last active" displays correctly

---

## Encryption & Security

### Entry Encryption

**Client-side process:**

```typescript
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

async function encryptEntry(content: string, signer: ethers.Signer) {
  // 1. Derive encryption key from wallet signature
  const message = "Derive DiaryBeast encryption key";
  const signature = await signer.signMessage(message);
  const encryptionKey = ethers.keccak256(signature);

  // 2. Encrypt content
  const encryptedContent = CryptoJS.AES.encrypt(
    content,
    encryptionKey
  ).toString();

  // 3. Generate content hash for verification
  const contentHash = ethers.keccak256(ethers.toUtf8Bytes(content));

  // 4. Sign the content hash
  const contentSignature = await signer.signMessage(
    ethers.getBytes(contentHash)
  );

  return {
    encryptedContent,
    contentHash,
    signature: contentSignature
  };
}
```

**Decryption:**

```typescript
async function decryptEntry(
  encryptedContent: string,
  signer: ethers.Signer
) {
  const message = "Derive DiaryBeast encryption key";
  const signature = await signer.signMessage(message);
  const encryptionKey = ethers.keccak256(signature);

  const decrypted = CryptoJS.AES.decrypt(
    encryptedContent,
    encryptionKey
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}
```

### Signature Verification (Backend)

```typescript
import { verifyMessage } from 'viem';

function verifyEntrySignature(
  contentHash: string,
  signature: string,
  expectedAddress: string
): boolean {
  const recoveredAddress = verifyMessage({
    message: { raw: contentHash },
    signature: signature,
  });

  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
}
```

### Security Measures

1. **Entry Privacy:**
   - All content encrypted client-side
   - Server never sees plaintext
   - Decryption key derived from user's wallet

2. **Authentication:**
   - Wallet signature verification on every request
   - No passwords or traditional auth

3. **Rate Limiting:**
   - 1 entry per day per user (business logic)
   - API rate limit: 100 requests/minute per IP

4. **Input Validation:**
   - Content length: max 50,000 characters
   - XSS prevention: Content sanitized on display
   - SQL injection: Prisma ORM parameterized queries

5. **Environment Variables:**
   ```bash
   OWNER_PRIVATE_KEY=      # Backend wallet (for minting/burning)
   DATABASE_URL=           # PostgreSQL connection
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=
   ```

---

## Deployment & Infrastructure

### Vercel Configuration

**vercel.json:**
```json
{
  "buildCommand": "npx prisma generate && next build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "OWNER_PRIVATE_KEY": "@owner-private-key",
    "NEXT_PUBLIC_ONCHAINKIT_API_KEY": "@onchainkit-api-key",
    "NEXT_PUBLIC_DIARY_TOKEN_ADDRESS": "@diary-token-address"
  }
}
```

### Database Migrations

```bash
# Generate migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy
```

### CI/CD Pipeline

**GitHub Actions (.github/workflows/deploy.yml):**
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npx prisma generate
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Monitoring

- **Vercel Analytics:** Page views, performance
- **Console logging:** API errors logged to Vercel
- **Smart contract events:** Monitor via Base block explorer

---

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Coinbase Wallet (for testing)
- Base Sepolia ETH (from faucet)

### Setup Steps

```bash
# 1. Clone repo
git clone https://github.com/dxdleady/diarybeast_front.git
cd diarybeast_front

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up database
npx prisma generate
npx prisma migrate dev

# 5. Seed shop items
npx prisma db seed

# 6. Deploy smart contract (local Hardhat network)
cd contracts
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost

# 7. Run dev server
npm run dev
# Open http://localhost:3000
```

### Environment Variables (.env.local)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/diarybeast"

# Web3
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your-api-key"
OWNER_PRIVATE_KEY="0x..."  # Backend wallet private key
NEXT_PUBLIC_DIARY_TOKEN_ADDRESS="0x..."  # Deployed contract address

# Network
NEXT_PUBLIC_CHAIN_ID="84532"  # Base Sepolia
NEXT_PUBLIC_RPC_URL="https://sepolia.base.org"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Testing

```bash
# Run smart contract tests
cd contracts
npx hardhat test

# Run Next.js in test mode
npm run test

# Manual testing checklist
# 1. Connect wallet
# 2. Complete onboarding
# 3. Create entry
# 4. Check token balance on Basescan
# 5. Purchase item from shop
# 6. View past entries
```

---

## Project Structure

```
diarybeast_front/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── onboarding/
│   ├── diary/
│   │   └── page.tsx
│   ├── shop/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── verify/route.ts
│   │   ├── entries/
│   │   │   └── route.ts
│   │   ├── life/
│   │   │   └── check/route.ts      # Life loss checking endpoint
│   │   ├── shop/
│   │   │   ├── items/route.ts
│   │   │   ├── purchase/route.ts
│   │   │   └── apply/route.ts
│   │   └── user/
│   │       └── [address]/route.ts
│   ├── layout.tsx
│   ├── providers.tsx
│   └── page.tsx
├── components/
│   ├── Pet.tsx                     # Updated with critical state
│   ├── RightSidebar.tsx            # Updated with last active
│   ├── WeeklyHistory.tsx
│   ├── EntryViewer.tsx
│   ├── TextEditor.tsx
│   ├── WalletConnect.tsx
│   ├── LifeCheckWrapper.tsx        # NEW: Life check automation
│   ├── LifeLossNotification.tsx    # NEW: Toast notifications
│   ├── CriticalLifeModal.tsx       # NEW: 0 lives modal
│   └── EntrySuccessModal.tsx       # NEW: Success with confetti
├── hooks/
│   └── useLifeCheck.ts             # NEW: Life checking hook
├── lib/
│   ├── prisma.ts
│   ├── encryption.ts
│   ├── EncryptionKeyContext.tsx
│   ├── blockchain.ts
│   ├── gamification/
│   │   └── lifeSystem.ts           # NEW: Core gamification logic
│   └── utils.ts
├── contracts/
│   ├── DiaryToken.sol
│   ├── scripts/deploy.ts
│   └── test/DiaryToken.test.ts
├── prisma/
│   ├── schema.prisma               # Updated with life tracking fields
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── backgrounds/
│   └── pets/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
├── hardhat.config.ts
├── package.json
├── TECHNICAL_DOCUMENTATION.md
├── DEVELOPMENT_PLAN.md
└── PRODUCT_DESIGN_ALPHA.md
```

---

## Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial page load | < 3s | Lighthouse |
| API response time | < 500ms | Vercel Analytics |
| Smart contract gas | < 100k gas | Hardhat gas reporter |
| Database query | < 100ms | Prisma metrics |
| Time to interactive | < 2s | Lighthouse |

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari 15+
- iOS Safari 15+
- Chrome Android (latest)

---

## Known Limitations

1. **Wallet dependency:** Requires Coinbase Wallet or compatible
2. **Gas fees:** Users pay gas for token operations (use Base for low fees)
3. **No offline mode:** Requires internet connection
4. **Single device:** Entries encrypted per-device (same wallet on different devices needs re-sync)

---

## Future Technical Improvements

- **v0.2:**
  - Redis caching for user sessions
  - WebSocket for real-time updates
  - Image upload for entries

- **v1.0:**
  - IPFS storage for entries (decentralized backup)
  - Multi-signature wallet support
  - GraphQL API

- **v2.0:**
  - React Native mobile app
  - ERC721 NFT pets
  - Gasless transactions (ERC-4337)

---

**Document Version:** 1.0
**Last Updated:** October 6, 2025
**Maintained By:** Tech Lead
