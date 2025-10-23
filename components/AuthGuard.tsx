'use client';

import { useAccount } from 'wagmi';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Global component that watches for wallet address changes
 * and handles logout when user switches wallets
 */
export function AuthGuard() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const prevAddressRef = useRef<string | undefined>();
  const isInitialMount = useRef(true);

  useEffect(() => {
    const currentAddress = address?.toLowerCase();
    const prevAddress = prevAddressRef.current;

    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevAddressRef.current = currentAddress;
      return;
    }

    // Detect address change
    if (prevAddress !== currentAddress) {
      // If user was on a protected page and address changed
      const protectedRoutes = ['/diary', '/profile', '/shop', '/insights', '/info', '/onboarding'];
      const isProtectedRoute = protectedRoutes.some((route) => pathname?.startsWith(route));

      if (isProtectedRoute && prevAddress) {
        router.push('/');
      }

      prevAddressRef.current = currentAddress;
    }
  }, [address, isConnected, router, pathname]);

  return null;
}
