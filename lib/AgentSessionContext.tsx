'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAgentSession } from './useAgentSession';

interface AgentSessionContextType {
  agentToken: string | null;
  agentAddress: string | null;
  isAgentSession: boolean;
  agentLogin: (token: string, address: string) => void;
  agentLogout: () => void;
}

const AgentSessionContext = createContext<AgentSessionContextType>({
  agentToken: null,
  agentAddress: null,
  isAgentSession: false,
  agentLogin: () => {},
  agentLogout: () => {},
});

export function AgentSessionProvider({ children }: { children: ReactNode }) {
  const session = useAgentSession();
  return <AgentSessionContext.Provider value={session}>{children}</AgentSessionContext.Provider>;
}

export function useAgent() {
  return useContext(AgentSessionContext);
}
