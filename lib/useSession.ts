'use client';

import { useAccount } from 'wagmi';
import { useAgent } from './AgentSessionContext';

/**
 * Unified session hook — returns address and connection state
 * from either wagmi wallet or agent Bearer token session.
 * Wagmi takes priority if both are present.
 */
export function useSession() {
  const { address: walletAddress, isConnected: walletConnected } = useAccount();
  const { agentAddress, agentToken, isAgentSession } = useAgent();

  const isConnected = walletConnected || isAgentSession;
  const address = walletConnected
    ? walletAddress
    : isAgentSession
      ? (agentAddress as `0x${string}`)
      : undefined;

  return {
    address,
    isConnected,
    isAgentSession: !walletConnected && isAgentSession,
    agentToken: !walletConnected && isAgentSession ? agentToken : null,
  };
}
