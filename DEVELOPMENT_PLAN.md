# План разработки DiaryBeast Alpha

## Общая стратегия

**Подход:** Разработка по слоям - от фундамента к UI
**Валидация:** Каждый этап проверяется перед переходом к следующему
**Приоритет:** Сначала критический путь (login → entry → token), потом UX

---

## День 1: Фундамент (Foundation)

### Шаг 1.1: Инициализация проекта (1 час)

**Задачи:**
```bash
# Создаем Next.js проект с TypeScript
npx create-next-app@latest . --typescript --tailwind --app --no-src

# Устанавливаем зависимости
npm install @coinbase/onchainkit wagmi viem @tanstack/react-query
npm install @prisma/client
npm install -D prisma
npm install zustand crypto-js ethers
```

**Структура папок:**
```
app/
├── (auth)/
│   ├── login/
│   └── onboarding/
├── diary/
├── shop/
├── api/
│   ├── auth/verify/
│   ├── entries/
│   └── shop/
components/
├── providers/
├── ui/
lib/
├── prisma.ts
├── encryption.ts
└── blockchain.ts
public/
├── pets/
└── backgrounds/
```

**Валидация:**
- ✅ `npm run dev` работает на localhost:3000
- ✅ Tailwind применяется корректно
- ✅ TypeScript без ошибок

---

### Шаг 1.2: Настройка Base Wallet (2 часа)

**1. Получить API ключ OnchainKit:**
- Зайти на https://portal.cdp.coinbase.com/
- Создать проект
- Скопировать API key

**2. Конфигурация:**

**.env.local:**
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your-key"
NEXT_PUBLIC_CHAIN_ID="84532"  # Base Sepolia
```

**app/providers.tsx:**
```typescript
'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';

const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'DiaryBeast',
      preference: 'smartWalletOnly', // Base Account
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={baseSepolia}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

**app/layout.tsx:**
```typescript
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**3. Кнопка подключения:**

**components/WalletConnect.tsx:**
```typescript
'use client';

import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount } from 'wagmi';

export function WalletConnect() {
  const { address, isConnected } = useAccount();

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <ConnectWallet />
      </div>
    );
  }

  return <ConnectWallet />;
}
```

**app/page.tsx (Welcome):**
```typescript
import { WalletConnect } from '@/components/WalletConnect';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">DiaryBeast</h1>
        <p className="text-gray-400 mb-8">Feed your beast, grow your mind</p>
        <WalletConnect />
      </div>
    </div>
  );
}
```

**Валидация:**
- ✅ Кнопка "Connect Wallet" появляется
- ✅ Клик открывает Coinbase Wallet modal
- ✅ После подключения показывается адрес
- ✅ В консоли нет ошибок Web3

**Критерий успеха:** Можете подключить кошелек и видите свой адрес на экране.

---

### Шаг 1.3: Деплой Smart Contract (2 часа)

**1. Установка Hardhat:**
```bash
mkdir contracts && cd contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init  # Выбрать "Create a TypeScript project"
npm install @openzeppelin/contracts
```

**2. Написание контракта:**

**contracts/DiaryToken.sol:**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DiaryToken is ERC20, Ownable {
    constructor() ERC20("DiaryToken", "DIARY") Ownable(msg.sender) {}

    function mintReward(address user, uint256 amount) external onlyOwner {
        _mint(user, amount);
    }

    function burnFrom(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }

    // Disable transfers (soul-bound)
    function transfer(address, uint256) public pure override returns (bool) {
        revert("DiaryToken: transfers disabled");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("DiaryToken: transfers disabled");
    }

    function approve(address, uint256) public pure override returns (bool) {
        revert("DiaryToken: approvals disabled");
    }
}
```

**3. Конфигурация Hardhat:**

**hardhat.config.ts:**
```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY!],
      chainId: 84532,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY!,
    },
  },
};

export default config;
```

**contracts/.env:**
```bash
DEPLOYER_PRIVATE_KEY="your-private-key"  # Новый кошелек только для деплоя!
BASESCAN_API_KEY="your-basescan-key"
```

**4. Скрипт деплоя:**

**scripts/deploy.ts:**
```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DiaryToken...");

  const DiaryToken = await ethers.getContractFactory("DiaryToken");
  const diaryToken = await DiaryToken.deploy();
  await diaryToken.waitForDeployment();

  const address = await diaryToken.getAddress();
  console.log("DiaryToken deployed to:", address);

  // Wait for block confirmations
  console.log("Waiting for block confirmations...");
  await diaryToken.deploymentTransaction()?.wait(5);

  // Verify
  console.log("Verifying contract...");
  await run("verify:verify", {
    address: address,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

**5. Получить testnet ETH:**
- Перейти на https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Или https://faucet.quicknode.com/base/sepolia
- Отправить на адрес деплоера

**6. Деплой:**
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network baseSepolia
```

**7. Сохранить адрес:**
```bash
# В корневой .env.local
NEXT_PUBLIC_DIARY_TOKEN_ADDRESS="0x..."  # Адрес из вывода deploy скрипта
OWNER_PRIVATE_KEY="..."  # Тот же ключ деплоера
```

**Валидация:**
- ✅ Контракт задеплоен на Base Sepolia
- ✅ Адрес контракта сохранен
- ✅ Можно посмотреть на https://sepolia.basescan.org/address/0x...
- ✅ Контракт верифицирован (видно код на Basescan)

**Критерий успеха:** Контракт на Basescan, можно вызвать `name()` и получить "DiaryToken".

---

### Шаг 1.4: База данных (1 час)

**1. Prisma setup:**
```bash
npx prisma init
```

**prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(cuid())
  walletAddress   String    @unique
  selectedAnimal  String?
  coinsBalance    Int       @default(0)
  livesRemaining  Int       @default(7)
  currentStreak   Int       @default(0)
  longestStreak   Int       @default(0)
  lastEntryDate   DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

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

  @@unique([userId, date])
  @@index([userId])
}

model Purchase {
  id          String   @id @default(cuid())
  userId      String
  itemType    String
  itemId      String
  price       Int
  txHash      String?
  purchasedAt DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Reward {
  id          String   @id @default(cuid())
  userId      String
  type        String
  amount      Int
  description String
  txHash      String
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model ShopItem {
  id          String  @id @default(cuid())
  type        String
  name        String
  description String?
  price       Int
  imageUrl    String
  available   Boolean @default(true)
  sortOrder   Int     @default(0)
}
```

**2. Настроить DB (используем Vercel Postgres или local):**

**Вариант A - Local PostgreSQL:**
```bash
# Установить PostgreSQL если нет
brew install postgresql  # macOS
brew services start postgresql

# Создать БД
createdb diarybeast

# .env.local
DATABASE_URL="postgresql://localhost:5432/diarybeast"
```

**Вариант B - Vercel Postgres (рекомендуется):**
- Зайти на vercel.com
- Create Project → Storage → Postgres
- Скопировать connection string в .env.local

**3. Миграция:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**4. Prisma Client:**

**lib/prisma.ts:**
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**5. Seed данные для магазина:**

**prisma/seed.ts:**
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.shopItem.createMany({
    data: [
      {
        id: 'bg-default',
        type: 'background',
        name: 'Default',
        description: 'Clean dark background',
        price: 0,
        imageUrl: '/backgrounds/default.jpg',
        sortOrder: 0,
      },
      {
        id: 'bg-sunset',
        type: 'background',
        name: 'Sunset',
        description: 'Warm sunset colors',
        price: 50,
        imageUrl: '/backgrounds/sunset.jpg',
        sortOrder: 1,
      },
      {
        id: 'bg-night',
        type: 'background',
        name: 'Night Sky',
        description: 'Starry night',
        price: 100,
        imageUrl: '/backgrounds/night.jpg',
        sortOrder: 2,
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**package.json:**
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```bash
npm install -D ts-node
npx prisma db seed
```

**Валидация:**
- ✅ `npx prisma studio` открывает UI
- ✅ Видно 3 ShopItem в базе
- ✅ Можно создать User вручную в Prisma Studio

**Критерий успеха:** База работает, seed данные загружены.

---

## День 2: Core Features

### Шаг 2.1: Аутентификация (2 часа)

**API endpoint для верификации:**

**app/api/auth/verify/route.ts:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMessage } from 'viem';

export async function POST(req: NextRequest) {
  try {
    const { address, message, signature } = await req.json();

    // Verify signature
    const isValid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { walletAddress: address.toLowerCase() },
    });

    const isNewUser = !user;

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress: address.toLowerCase(),
        },
      });
    }

    return NextResponse.json({ user, isNewUser });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}
```

**Client hook:**

**lib/useAuth.ts:**
```typescript
'use client';

import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address && !user) {
      authenticate();
    }
  }, [isConnected, address]);

  async function authenticate() {
    if (!address) return;

    setLoading(true);
    try {
      const message = 'Authenticate to DiaryBeast';
      const signature = await signMessageAsync({ message });

      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      const data = await res.json();
      setUser(data.user);

      // Redirect if new user
      if (data.isNewUser) {
        window.location.href = '/onboarding';
      }
    } catch (error) {
      console.error('Auth failed:', error);
    } finally {
      setLoading(false);
    }
  }

  return { user, loading, isConnected };
}
```

**Валидация:**
- ✅ Подключение кошелька автоматически создает User в БД
- ✅ В Prisma Studio видно нового юзера с walletAddress
- ✅ Повторное подключение не создает дубликаты

---

### Шаг 2.2: Онбординг (1 час)

**app/onboarding/page.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const { address } = useAccount();
  const router = useRouter();
  const [selectedAnimal, setSelectedAnimal] = useState<'cat' | 'dog' | null>(null);

  async function handleComplete() {
    if (!selectedAnimal || !address) return;

    await fetch(`/api/user/${address}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedAnimal }),
    });

    router.push('/diary');
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Choose Your Beast</h1>

        <div className="flex gap-8 mb-8">
          <button
            onClick={() => setSelectedAnimal('cat')}
            className={`p-8 border-2 rounded-lg ${
              selectedAnimal === 'cat' ? 'border-blue-500' : 'border-gray-700'
            }`}
          >
            <div className="text-6xl mb-4">🐱</div>
            <div className="text-xl">Cat</div>
          </button>

          <button
            onClick={() => setSelectedAnimal('dog')}
            className={`p-8 border-2 rounded-lg ${
              selectedAnimal === 'dog' ? 'border-blue-500' : 'border-gray-700'
            }`}
          >
            <div className="text-6xl mb-4">🐶</div>
            <div className="text-xl">Dog</div>
          </button>
        </div>

        <button
          onClick={handleComplete}
          disabled={!selectedAnimal}
          className="px-8 py-3 bg-blue-600 rounded-lg disabled:opacity-50"
        >
          Start Writing
        </button>
      </div>
    </div>
  );
}
```

**app/api/user/[address]/route.ts:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  const { selectedAnimal } = await req.json();

  const user = await prisma.user.update({
    where: { walletAddress: params.address.toLowerCase() },
    data: { selectedAnimal },
  });

  return NextResponse.json({ user });
}
```

**Валидация:**
- ✅ Выбор кота/собаки сохраняется в БД
- ✅ Редирект на /diary после выбора

---

### Шаг 2.3: Создание записи + Шифрование (3 часа)

**lib/encryption.ts:**
```typescript
import CryptoJS from 'crypto-js';
import { keccak256, toBytes, toHex } from 'viem';

export function deriveKey(signature: string): string {
  return keccak256(toBytes(signature));
}

export function encryptContent(content: string, key: string): string {
  return CryptoJS.AES.encrypt(content, key).toString();
}

export function decryptContent(encrypted: string, key: string): string {
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function hashContent(content: string): string {
  return keccak256(toBytes(content));
}
```

**app/diary/page.tsx:**
```typescript
'use client';

import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { deriveKey, encryptContent, hashContent } from '@/lib/encryption';

export default function Diary() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!address || !content.trim()) return;

    setSaving(true);
    try {
      // 1. Derive encryption key
      const keyMessage = 'Derive DiaryBeast encryption key';
      const keySig = await signMessageAsync({ message: keyMessage });
      const encryptionKey = deriveKey(keySig);

      // 2. Encrypt content
      const encryptedContent = encryptContent(content, encryptionKey);

      // 3. Hash content
      const contentHash = hashContent(content);

      // 4. Sign hash
      const signature = await signMessageAsync({
        message: { raw: contentHash as `0x${string}` }
      });

      // 5. Save to API
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: address,
          encryptedContent,
          signature,
          contentHash,
          wordCount: content.split(/\s+/).length,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(`Entry saved! +${data.reward.amount} DIARY`);
        setContent('');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save entry');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Today's Entry</h1>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How was your day?"
          className="w-full h-64 p-4 bg-gray-800 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSave}
          disabled={!content.trim() || saving}
          className="mt-4 px-8 py-3 bg-blue-600 rounded-lg disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save & Sign Entry'}
        </button>
      </div>
    </div>
  );
}
```

**app/api/entries/route.ts:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMessage } from 'viem';
import { mintTokens } from '@/lib/blockchain';

export async function POST(req: NextRequest) {
  try {
    const { userAddress, encryptedContent, signature, contentHash, wordCount } = await req.json();

    // 1. Verify signature
    const isValid = await verifyMessage({
      address: userAddress as `0x${string}`,
      message: { raw: contentHash },
      signature,
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Check if entry exists today
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingEntry = await prisma.entry.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
        },
      },
    });

    if (existingEntry) {
      return NextResponse.json({ error: 'Entry already exists for today' }, { status: 409 });
    }

    // 3. Create entry
    const entry = await prisma.entry.create({
      data: {
        userId: user.id,
        encryptedContent,
        signature,
        contentHash,
        wordCount,
      },
    });

    // 4. Determine reward
    const entryCount = await prisma.entry.count({ where: { userId: user.id } });
    const isFirstEntry = entryCount === 1;
    const rewardAmount = isFirstEntry ? 50 : 10;

    // 5. Mint tokens
    const txHash = await mintTokens(userAddress, rewardAmount);

    // 6. Create reward record
    await prisma.reward.create({
      data: {
        userId: user.id,
        type: isFirstEntry ? 'first_entry' : 'daily_entry',
        amount: rewardAmount,
        description: isFirstEntry ? 'First entry bonus!' : 'Daily entry reward',
        txHash,
      },
    });

    // 7. Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        coinsBalance: { increment: rewardAmount },
        currentStreak: { increment: 1 },
        lastEntryDate: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      entry: { id: entry.id, date: entry.date },
      reward: { amount: rewardAmount, type: isFirstEntry ? 'first_entry' : 'daily_entry', txHash },
      updatedUser: {
        coinsBalance: updatedUser.coinsBalance,
        currentStreak: updatedUser.currentStreak,
      },
    });
  } catch (error) {
    console.error('Entry creation error:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
```

**lib/blockchain.ts:**
```typescript
import { createWalletClient, http, parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const DIARY_TOKEN_ABI = [
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'mintReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const account = privateKeyToAccount(process.env.OWNER_PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

export async function mintTokens(userAddress: string, amount: number): Promise<string> {
  const hash = await walletClient.writeContract({
    address: process.env.NEXT_PUBLIC_DIARY_TOKEN_ADDRESS as `0x${string}`,
    abi: DIARY_TOKEN_ABI,
    functionName: 'mintReward',
    args: [userAddress as `0x${string}`, BigInt(amount * 10 ** 18)],
  });

  return hash;
}

export async function burnTokens(userAddress: string, amount: number): Promise<string> {
  const hash = await walletClient.writeContract({
    address: process.env.NEXT_PUBLIC_DIARY_TOKEN_ADDRESS as `0x${string}`,
    abi: DIARY_TOKEN_ABI,
    functionName: 'burnFrom',
    args: [userAddress as `0x${string}`, BigInt(amount * 10 ** 18)],
  });

  return hash;
}
```

**Валидация:**
- ✅ Запись сохраняется в БД
- ✅ Токены минтятся на Base Sepolia (проверить на Basescan)
- ✅ Баланс юзера обновляется
- ✅ Нельзя создать 2 записи за день

---

## День 3: Pet + Shop

### Шаг 3.1: Питомец (2 часа)

**components/Pet.tsx:**
```typescript
'use client';

import { useEffect, useState } from 'react';

interface PetProps {
  animal: 'cat' | 'dog';
  livesRemaining: number;
}

export function Pet({ animal, livesRemaining }: PetProps) {
  const [emotion, setEmotion] = useState<'happy' | 'sad'>('happy');

  useEffect(() => {
    setEmotion(livesRemaining >= 4 ? 'happy' : 'sad');
  }, [livesRemaining]);

  const emoji = animal === 'cat'
    ? (emotion === 'happy' ? '😺' : '😿')
    : (emotion === 'happy' ? '🐶' : '😢🐕');

  return (
    <div className="text-center">
      <div className={`text-9xl transition-transform ${emotion === 'happy' ? 'animate-bounce' : ''}`}>
        {emoji}
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-2">Pet Health</div>
        <div className="flex gap-1 justify-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="text-2xl">
              {i < livesRemaining ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Добавить в app/diary/page.tsx:**
```typescript
import { Pet } from '@/components/Pet';
import { useEffect, useState } from 'react';

// В компоненте:
const [userData, setUserData] = useState<any>(null);

useEffect(() => {
  if (address) {
    fetch(`/api/user/${address}`)
      .then(res => res.json())
      .then(data => setUserData(data));
  }
}, [address]);

// В JSX перед textarea:
{userData && (
  <div className="mb-8">
    <Pet
      animal={userData.selectedAnimal}
      livesRemaining={userData.livesRemaining}
    />
    <div className="text-center mt-4">
      <span className="text-2xl">💎 {userData.coinsBalance} DIARY</span>
      <span className="ml-4">🔥 {userData.currentStreak} days</span>
    </div>
  </div>
)}
```

**app/api/user/[address]/route.ts (добавить GET):**
```typescript
export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  const user = await prisma.user.findUnique({
    where: { walletAddress: params.address.toLowerCase() },
    include: {
      _count: {
        select: { entries: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...user,
    totalEntries: user._count.entries,
  });
}
```

**Валидация:**
- ✅ Питомец отображается (кот или собака)
- ✅ Эмоция меняется в зависимости от lives
- ✅ Сердечки показывают здоровье
- ✅ Баланс токенов виден

---

### Шаг 3.2: Магазин (2 часа)

**app/shop/page.tsx:**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

export default function Shop() {
  const { address } = useAccount();
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch('/api/shop/items').then(r => r.json()),
      fetch(`/api/shop/purchases?userAddress=${address}`).then(r => r.json()),
      fetch(`/api/user/${address}`).then(r => r.json()),
    ]).then(([itemsData, purchasesData, userData]) => {
      setItems(itemsData.items);
      setPurchases(purchasesData.purchases.map((p: any) => p.itemId));
      setBalance(userData.coinsBalance);
    });
  }, [address]);

  async function handlePurchase(itemId: string, price: number) {
    if (balance < price) {
      alert('Not enough DIARY tokens!');
      return;
    }

    try {
      const res = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress: address, itemId }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Purchase successful!');
        setPurchases([...purchases, itemId]);
        setBalance(data.updatedBalance);
      }
    } catch (error) {
      alert('Purchase failed');
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Shop</h1>
        <div className="text-xl mb-8">💎 {balance} DIARY</div>

        <div className="grid grid-cols-3 gap-4">
          {items.map((item: any) => {
            const owned = purchases.includes(item.id);
            return (
              <div key={item.id} className="border border-gray-700 rounded-lg p-4">
                <img src={item.imageUrl} alt={item.name} className="w-full h-32 object-cover rounded mb-2" />
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                <p className="text-lg font-bold">{item.price} DIARY</p>

                {owned ? (
                  <div className="mt-2 text-green-500">✓ Owned</div>
                ) : (
                  <button
                    onClick={() => handlePurchase(item.id, item.price)}
                    disabled={balance < item.price || item.price === 0}
                    className="mt-2 w-full px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
                  >
                    Buy
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

**app/api/shop/items/route.ts:**
```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const items = await prisma.shopItem.findMany({
    where: { available: true },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json({ items });
}
```

**app/api/shop/purchase/route.ts:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { burnTokens } from '@/lib/blockchain';

export async function POST(req: NextRequest) {
  const { userAddress, itemId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { walletAddress: userAddress.toLowerCase() },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const item = await prisma.shopItem.findUnique({ where: { id: itemId } });

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }

  if (user.coinsBalance < item.price) {
    return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
  }

  // Check if already owned
  const existing = await prisma.purchase.findFirst({
    where: { userId: user.id, itemId },
  });

  if (existing) {
    return NextResponse.json({ error: 'Already owned' }, { status: 409 });
  }

  // Burn tokens
  let txHash = null;
  if (item.price > 0) {
    txHash = await burnTokens(userAddress, item.price);
  }

  // Create purchase
  await prisma.purchase.create({
    data: {
      userId: user.id,
      itemType: item.type,
      itemId: item.id,
      price: item.price,
      txHash,
    },
  });

  // Update balance
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { coinsBalance: { decrement: item.price } },
  });

  return NextResponse.json({
    success: true,
    updatedBalance: updatedUser.coinsBalance,
    txHash,
  });
}
```

**app/api/shop/purchases/route.ts:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const userAddress = req.nextUrl.searchParams.get('userAddress');

  const user = await prisma.user.findUnique({
    where: { walletAddress: userAddress?.toLowerCase() },
    include: { purchases: true },
  });

  return NextResponse.json({ purchases: user?.purchases || [] });
}
```

**Валидация:**
- ✅ Магазин показывает 3 фона
- ✅ Покупка списывает токены
- ✅ Транзакция burn видна на Basescan
- ✅ Нельзя купить дважды

---

## Критерии завершения Alpha

### Минимальный путь работает:
1. ✅ Подключил кошелек
2. ✅ Выбрал питомца
3. ✅ Написал запись
4. ✅ Получил 50+10 = 60 токенов
5. ✅ Купил фон за 50 токенов
6. ✅ Питомец показывает статус

### Проверка на Basescan:
- Mint транзакция (+60 tokens)
- Burn транзакция (-50 tokens)
- Баланс пользователя = 10 tokens

---

## Следующие шаги (если есть время)

1. Музыкальный плеер (1 час)
2. Просмотр прошлых записей (2 часа)
3. Streak бонус за 7 дней (1 час)
4. UI polish (анимации, лоадеры)

**Документ готов для начала разработки!**
