# Technology Stack & Dependencies

<cite>
**Referenced Files in This Document**   
- [next.config.ts](file://next.config.ts)
- [tailwind.config.ts](file://tailwind.config.ts)
- [hardhat.config.ts](file://contracts/hardhat.config.ts)
- [package.json](file://package.json)
- [contracts/package.json](file://contracts/package.json)
- [lib/blockchain.ts](file://lib/blockchain.ts)
- [lib/prisma.ts](file://lib/prisma.ts)
- [components/WalletConnect.tsx](file://components/WalletConnect.tsx)
- [lib/stores/petStore.ts](file://lib/stores/petStore.ts)
- [lib/contexts/MusicContext.tsx](file://lib/contexts/MusicContext.tsx)
</cite>

## Table of Contents

1. [Frontend Framework](#frontend-framework)
2. [Styling & Design System](#styling--design-system)
3. [State Management](#state-management)
4. [Blockchain Integration](#blockchain-integration)
5. [Database & ORM](#database--orm)
6. [Smart Contract Development](#smart-contract-development)
7. [Key Dependencies](#key-dependencies)
8. [Configuration Examples](#configuration-examples)
9. [Deployment (Vercel)](#deployment-vercel)
10. [Technology Rationale](#technology-rationale)

## Frontend Framework

The DiaryBeast application is built on **Next.js 14** using the **App Router** architecture, enabling server-side rendering (SSR), static site generation (SSG), and dynamic routing. The framework supports React Server Components (RSC), which optimize performance by reducing client-side JavaScript bundle size and improving initial load times. API routes are implemented within the `app/api` directory, following the file-based routing convention for clean, modular backend endpoints.

React 18 provides the component architecture, leveraging concurrent rendering features such as Suspense and useTransition for smoother user interactions. The application uses React's client components where interactivity is required, while server components handle data fetching and static content.

**Section sources**

- [package.json](file://package.json#L10-L11)
- [app/page.tsx](file://app/page.tsx)
- [app/api/entries/route.ts](file://app/api/entries/route.ts)

## Styling & Design System

DiaryBeast employs **Tailwind CSS** as its utility-first styling framework, enabling rapid UI development with minimal custom CSS. The design system is configured through `tailwind.config.ts`, where custom color variables, fonts, animations, and shadows are defined using CSS variables for dynamic theming.

The configuration extends the default theme with semantic color names such as `primary`, `secondary`, and `accent`, mapping to LCD-inspired cyan, Base blue, and pixel green tones. Custom keyframes and animations like `pulse-slow`, `float`, and `glow` enhance the retro-digital aesthetic. Font families are modularly defined with `sans`, `mono`, and `display` variants for typographic consistency.

**Section sources**

- [tailwind.config.ts](file://tailwind.config.ts#L1-L115)
- [globals.css](file://app/globals.css)
- [components/Pet.tsx](file://components/Pet.tsx)

## State Management

State management in DiaryBeast combines **Zustand** for global state stores and **React Context** for provider-based state distribution.

The `usePetStore` Zustand store manages core pet state including lives, happiness, cooldowns, and interaction actions (`feed`, `play`). It handles optimistic updates, API synchronization, and time-based cooldown logic. The store is initialized with server data and provides computed properties like `canFeed` and `canPlay` based on elapsed time since last action.

React Context is used for simpler, scoped state needs. The `MusicContext` provides playback state (`isPlaying`, `currentTrack`) and control methods (`play`, `pause`, `toggle`) across components via the `MusicProvider`. This pattern ensures decoupled, reusable music controls without prop drilling.

**Section sources**

- [lib/stores/petStore.ts](file://lib/stores/petStore.ts#L1-L234)
- [lib/contexts/MusicContext.tsx](file://lib/contexts/MusicContext.tsx#L1-L53)

## Blockchain Integration

Blockchain functionality is implemented using **Wagmi** and **Viem** for wallet connection, transaction signing, and on-chain interactions. The app connects to the Base Sepolia testnet, with wallet state managed via `useAccount` from Wagmi.

The `@coinbase/onchainkit` library enhances the wallet experience with pre-built UI components such as `ConnectWallet`, `WalletDropdown`, and `Identity`, providing seamless onboarding and address display. These components integrate directly with Wagmi’s hooks for consistent state.

Low-level blockchain operations are abstracted in `lib/blockchain.ts`, which uses Viem to interact with the DiaryToken smart contract. Functions like `mintTokens`, `burnTokens`, and `getTokenBalance` perform write and read operations on-chain, while `syncUserBalance` ensures database consistency with on-chain token balances.

**Section sources**

- [components/WalletConnect.tsx](file://components/WalletConnect.tsx#L1-L34)
- [lib/blockchain.ts](file://lib/blockchain.ts#L1-L112)
- [package.json](file://package.json#L20-L22)

## Database & ORM

The application uses **Prisma ORM** with **PostgreSQL** as the backend database layer. Prisma provides a type-safe database client and schema migration system, enabling efficient CRUD operations and relationship management.

The `prisma` client is instantiated in `lib/prisma.ts` with a singleton pattern to prevent multiple instances in development. It is used throughout API routes for user data persistence, including wallet addresses, coin balances, diary entries, and pet state.

Database seeding is supported via `prisma/seed.ts`, executed through the `db:seed` script. The Prisma schema (not shown) likely defines models for User, Entry, Pet, ShopItem, and Purchase, with relations reflecting the gamification system.

**Section sources**

- [lib/prisma.ts](file://lib/prisma.ts#L1-L9)
- [package.json](file://package.json#L18)
- [prisma/seed.ts](file://prisma/seed.ts)

## Smart Contract Development

Smart contracts are developed using **Hardhat** with **Solidity 0.8.20**, targeting the Base network. The contract `DiaryToken.sol` extends **OpenZeppelin**'s `Ownable` and `ERC20` standards, implementing a custom token with minting and burning capabilities for gamified rewards.

TypeChain generates TypeScript bindings in the `typechain-types` directory, enabling type-safe contract interactions from the frontend. The `hardhat.config.ts` configures deployment to Base Sepolia, with Etherscan integration for verification via BaseScan.

The deployment script (`scripts/deploy.ts`) automates contract deployment, while the Hardhat Toolbox provides testing, compilation, and task automation. Environment variables manage private keys and API endpoints securely.

**Section sources**

- [contracts/hardhat.config.ts](file://contracts/hardhat.config.ts#L1-L41)
- [contracts/contracts/DiaryToken.sol](file://contracts/contracts/DiaryToken.sol)
- [contracts/package.json](file://contracts/package.json#L1-L19)

## Key Dependencies

| Dependency                | Role                                                |
| ------------------------- | --------------------------------------------------- |
| `@coinbase/onchainkit`    | Wallet UI, identity, and connection components      |
| `wagmi`                   | React hooks for wallet and chain state management   |
| `viem`                    | Type-safe Ethereum client for contract interactions |
| `@prisma/client`          | Type-safe database access and ORM                   |
| `zustand`                 | Lightweight global state management                 |
| `react` / `react-dom`     | UI component model and rendering                    |
| `next`                    | App Router, SSR, API routes, and build system       |
| `tailwindcss`             | Utility-first CSS framework                         |
| `@tanstack/react-query`   | Data fetching and caching                           |
| `@mubert/sdk`             | Music integration (inferred from context)           |
| `@openzeppelin/contracts` | Secure, audited smart contract libraries            |

**Section sources**

- [package.json](file://package.json#L1-L71)
- [contracts/package.json](file://contracts/package.json#L1-L19)

## Configuration Examples

### Next.js Configuration

The `next.config.ts` file configures Webpack to exclude certain native modules (`pino-pretty`, `lokijs`, `encoding`) and disables fallback for `@react-native-async-storage/async-storage`, ensuring compatibility with the browser environment.

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
    };
    return config;
  },
};
```

**Section sources**

- [next.config.ts](file://next.config.ts#L1-L14)

### Tailwind Configuration

The `tailwind.config.ts` defines a custom design system with dynamic colors, fonts, and animations. Content paths include all UI components and pages to ensure utility generation.

```typescript
// tailwind.config.ts
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
    },
  },
};
```

**Section sources**

- [tailwind.config.ts](file://tailwind.config.ts#L1-L115)

## Deployment (Vercel)

DiaryBeast is deployed on **Vercel**, which provides seamless integration with Next.js, automatic deployments from Git, and edge functions for API routes.

### Required Environment Variables

All environment variables from `.env.local` must be added to Vercel project settings:

**Critical for Blockchain:**
- `OWNER_PRIVATE_KEY` - Private key for minting tokens (⚠️ **KEEP SECRET**)
- `NEXT_PUBLIC_DIARY_TOKEN_ADDRESS` - DiaryToken contract address
- `NEXT_PUBLIC_CHAIN_ID` - Network chain ID (84532 for Base Sepolia)

**Database:**
- `DATABASE_URL` - PostgreSQL connection string (use Vercel Postgres or external)

**APIs:**
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` - OnchainKit API key for wallet components
- `GROQ_API_KEY` - For AI-powered diary analysis
- `OPENROUTER_API_KEY` - AI routing service
- `ADMIN_API_KEY` - Admin operations authentication
- `MUBERT_COMPANY_ID` - Music generation
- `MUBERT_LICENSE_TOKEN` - Music API license

### Deployment Steps

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Select the appropriate branch (typically `main`)

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables listed above
   - Set for Production, Preview, and Development environments as needed

3. **Build Settings** (Default Next.js settings work)
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install` or `pnpm install`

4. **Deploy**
   - Vercel automatically deploys on git push
   - Monitor build logs for errors
   - Check deployment URL once live

### Verification

After deployment, verify:
- [ ] Wallet connection works (Coinbase Smart Wallet, MetaMask, Phantom)
- [ ] Authentication flow completes (signature modal appears)
- [ ] Token minting works (check Base Sepolia Basescan)
- [ ] Database connections succeed
- [ ] Basename displays correctly (if user has one on Base Mainnet)

Use the debug endpoint: `https://your-domain.vercel.app/api/debug/env-check` to verify all environment variables are set.

### Common Issues

**Blockchain transactions fail:**
- Cause: Missing `OWNER_PRIVATE_KEY`
- Fix: Add to Vercel environment variables and redeploy

**Database connection errors:**
- Cause: Missing or incorrect `DATABASE_URL`
- Fix: Verify connection string format and credentials

**Basename not showing:**
- Expected: Basenames only exist on Base Mainnet, not testnet
- App queries mainnet for names, uses Sepolia for transactions

## Technology Rationale

The technology stack was selected to balance developer experience, performance, security, and scalability:

- **Next.js 14 + App Router**: Enables SSR for SEO, fast loading, and unified full-stack development.
- **React 18**: Provides modern UI patterns with concurrent features for responsive interactions.
- **TypeScript**: Ensures type safety across frontend, backend, and smart contracts.
- **Tailwind CSS**: Accelerates UI development with utility-first approach and design consistency.
- **Zustand**: Minimalist, scalable state management without boilerplate.
- **Wagmi + Viem**: Industry-standard, secure, and well-documented Web3 libraries.
- **@coinbase/onchainkit**: Streamlines wallet onboarding and identity with trusted components.
- **Prisma + PostgreSQL**: Robust, type-safe database layer with strong relations and migrations.
- **Hardhat + OpenZeppelin**: Secure, testable smart contract development with best practices.
- **TypeChain**: Enables type-safe contract interactions, reducing runtime errors.

This stack supports a seamless, performant, and secure experience for users interacting with both web and blockchain layers.

**Section sources**

- [package.json](file://package.json)
- [contracts/package.json](file://contracts/package.json)
- [next.config.ts](file://next.config.ts)
- [tailwind.config.ts](file://tailwind.config.ts)
- [hardhat.config.ts](file://contracts/hardhat.config.ts)
