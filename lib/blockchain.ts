import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
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
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const account = privateKeyToAccount(
  process.env.OWNER_PRIVATE_KEY as `0x${string}`
);

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(),
});

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function mintTokens(
  userAddress: string,
  amount: number
): Promise<string> {
  const hash = await walletClient.writeContract({
    address: process.env.NEXT_PUBLIC_DIARY_TOKEN_ADDRESS as `0x${string}`,
    abi: DIARY_TOKEN_ABI,
    functionName: 'mintReward',
    args: [userAddress as `0x${string}`, BigInt(amount * 10 ** 18)],
  });

  return hash;
}

export async function burnTokens(
  userAddress: string,
  amount: number
): Promise<string> {
  const hash = await walletClient.writeContract({
    address: process.env.NEXT_PUBLIC_DIARY_TOKEN_ADDRESS as `0x${string}`,
    abi: DIARY_TOKEN_ABI,
    functionName: 'burnFrom',
    args: [userAddress as `0x${string}`, BigInt(amount * 10 ** 18)],
  });

  return hash;
}

export async function getTokenBalance(userAddress: string): Promise<number> {
  const balance = await publicClient.readContract({
    address: process.env.NEXT_PUBLIC_DIARY_TOKEN_ADDRESS as `0x${string}`,
    abi: DIARY_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [userAddress as `0x${string}`],
  });

  // Convert from wei to tokens (18 decimals)
  return Number(balance) / 10 ** 18;
}

export async function syncUserBalance(userAddress: string, prisma: any): Promise<number> {
  // Get on-chain balance
  const onChainBalance = await getTokenBalance(userAddress);

  // Update database
  await prisma.user.update({
    where: { walletAddress: userAddress.toLowerCase() },
    data: { coinsBalance: onChainBalance },
  });

  return onChainBalance;
}
