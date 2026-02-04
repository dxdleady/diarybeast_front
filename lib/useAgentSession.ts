'use client';

import { useState, useEffect, useCallback } from 'react';

interface AgentSession {
  token: string;
  address: string;
}

const STORAGE_KEY = 'diarybeast_agent_session';

export function useAgentSession() {
  const [session, setSession] = useState<AgentSession | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback((token: string, address: string) => {
    const s = { token, address: address.toLowerCase() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return {
    agentToken: session?.token || null,
    agentAddress: session?.address || null,
    isAgentSession: !!session,
    agentLogin: login,
    agentLogout: logout,
  };
}
