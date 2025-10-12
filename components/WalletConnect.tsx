'use client';

import { ConnectWallet, Wallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';

export function WalletConnect() {
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
          </Identity>
        </WalletDropdown>
      </Wallet>
    );
  }

  return (
    <ConnectWallet
      text="Play & Grow"
      className="btn-primary font-semibold py-3 px-8 rounded-lg transition-colors font-mono"
    />
  );
}
