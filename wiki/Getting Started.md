# Getting Started

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [package.json](file://package.json)
- [contracts/package.json](file://contracts/package.json)
- [next.config.ts](file://next.config.ts)
- [prisma/seed.ts](file://prisma/seed.ts)
- [lib/useAuth.ts](file://lib/useAuth.ts)
- [components/WalletConnect.tsx](file://components/WalletConnect.tsx)
- [contracts/hardhat.config.ts](file://contracts/hardhat.config.ts)
- [app/page.tsx](file://app/page.tsx)
- [lib/prisma.ts](file://lib/prisma.ts)
</cite>

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Repository Setup](#repository-setup)
3. [Environment Configuration](#environment-configuration)
4. [Development Workflow](#development-workflow)
5. [Common Commands](#common-commands)
6. [Troubleshooting](#troubleshooting)
7. [Setup Verification](#setup-verification)

## Prerequisites

Before setting up the DiaryBeast development environment, ensure you have the following prerequisites installed and configured:

- **Node.js**: Version 18 or higher (LTS recommended)
- **pnpm**: Package manager for Node.js (install via `npm install -g pnpm`)
- **PostgreSQL**: Database system for local development
- **Wallet Setup**: Coinbase Wallet or any EVM-compatible wallet for testing
- **Base Sepolia Testnet**: Configure your wallet to connect to Base Sepolia network
- **Environment Variables**: Required for API keys, blockchain settings, and database connections

These prerequisites are essential for running the application locally and interacting with the blockchain network.

**Section sources**
- [README.md](file://README.md#L1-L3)
- [package.json](file://package.json#L1-L72)

## Repository Setup

To set up the DiaryBeast repository, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/dxdleady/diarybeast_front.git
   cd diarybeast_front
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

3. Navigate to the contracts directory and install dependencies:
   ```bash
   cd contracts
   pnpm install
   ```

4. Return to the root directory:
   ```bash
   cd ..
   ```

This process sets up the project structure and installs all necessary dependencies for both the frontend and smart contracts.

**Section sources**
- [package.json](file://package.json#L1-L72)
- [contracts/package.json](file://contracts/package.json#L1-L10)

## Environment Configuration

Configure the environment variables for the DiaryBeast application by creating a `.env.local` file in the root directory. Populate it with the following variables:

```env
# OnchainKit API Key
NEXT_PUBLIC_ONCHAINKIT_API_KEY="your-onchainkit-api-key"

# Base Sepolia Network Configuration
NEXT_PUBLIC_CHAIN_ID="84532"

# Database URL (PostgreSQL)
DATABASE_URL="postgresql://localhost:5432/diarybeast"

# Base Sepolia Testnet Configuration
OWNER_PRIVATE_KEY="your-private-key"
BASESCAN_API_KEY="your-basescan-api-key"

# Smart Contract Address
NEXT_PUBLIC_DIARY_TOKEN_ADDRESS="0xeA621096594d5D7E3b2232A4F38365AdA9D92c14"
```

Ensure that the `DATABASE_URL` points to your local PostgreSQL instance or a remote database. The `OWNER_PRIVATE_KEY` should belong to a wallet funded with Base Sepolia testnet ETH.

**Section sources**
- [contracts/hardhat.config.ts](file://contracts/hardhat.config.ts#L1-L42)
- [prisma/seed.ts](file://prisma/seed.ts#L1-L125)

## Development Workflow

The development workflow for DiaryBeast involves starting the Next.js server, running Prisma migrations, and connecting to the blockchain network. Follow these steps:

1. Start the Next.js development server:
   ```bash
   pnpm dev
   ```

2. Run Prisma migration to set up the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Seed the database with initial data:
   ```bash
   pnpm db:seed
   ```

5. Connect to the Base Sepolia testnet using your wallet. Ensure your wallet is configured to interact with the smart contract deployed on the network.

This workflow ensures that the application is ready for development and testing.

**Section sources**
- [next.config.ts](file://next.config.ts#L1-L15)
- [lib/prisma.ts](file://lib/prisma.ts#L1-L8)

## Common Commands

Use the following commands for common development tasks:

- **Start Development Server**:
  ```bash
  pnpm dev
  ```

- **Build Production Version**:
  ```bash
  pnpm build
  ```

- **Start Storybook for Component Development**:
  ```bash
  pnpm storybook
  ```

- **Run Tests**:
  ```bash
  pnpm test
  ```

- **Lint Code**:
  ```bash
  pnpm lint
  ```

These commands streamline the development process and ensure consistency across the team.

**Section sources**
- [package.json](file://package.json#L1-L72)

## Troubleshooting

Address common setup issues with the following troubleshooting tips:

- **Port Conflicts**: If the development server fails to start, ensure port 3000 is free. Use `lsof -i :3000` to identify and terminate conflicting processes.

- **Missing Environment Variables**: Verify that all required environment variables are present in `.env.local`. Missing variables can cause runtime errors.

- **Wallet Connection Problems**: Ensure your wallet is connected to the Base Sepolia network. Check the network configuration in your wallet settings.

- **Database Migration Errors**: If Prisma migration fails, verify the `DATABASE_URL` and ensure PostgreSQL is running. Use `npx prisma studio` to inspect the database state.

- **Smart Contract Interaction Issues**: Confirm that the `NEXT_PUBLIC_DIARY_TOKEN_ADDRESS` matches the deployed contract address on Base Sepolia.

Resolving these issues ensures a smooth development experience.

**Section sources**
- [lib/useAuth.ts](file://lib/useAuth.ts#L16-L99)
- [components/WalletConnect.tsx](file://components/WalletConnect.tsx#L6-L33)

## Setup Verification

Verify the setup by writing a test entry and checking pet state updates:

1. Start the development server with `pnpm dev`.
2. Open the application in your browser and connect your wallet.
3. Write a test diary entry and save it.
4. Observe the pet's state update: lives should increase, and happiness should improve.
5. Check the console for successful API calls and blockchain interactions.

This verification confirms that the development environment is correctly configured and functional.

**Section sources**
- [app/page.tsx](file://app/page.tsx#L1-L203)
- [components/PetEvolution.tsx](file://components/PetEvolution.tsx#L41-L113)