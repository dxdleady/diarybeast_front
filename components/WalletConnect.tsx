'use client';

import { ConnectWallet, Wallet, WalletDropdown } from '@coinbase/onchainkit/wallet';
import { Address, Avatar, Name, Identity } from '@coinbase/onchainkit/identity';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { base } from 'wagmi/chains';
import { useEffect, useState } from 'react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="btn-primary font-semibold py-3 px-8 rounded-lg transition-colors font-mono">
        Play & Grow
      </button>
    );
  }

  if (isConnected && address) {
    return (
      <Wallet>
        <ConnectWallet>
          <Avatar address={address} chain={base} className="h-6 w-6" />
          <Name address={address} chain={base} />
        </ConnectWallet>
        <WalletDropdown>
          <Identity address={address} chain={base} className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
          </Identity>
        </WalletDropdown>
      </Wallet>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="btn-primary font-semibold py-3 px-8 rounded-lg transition-colors font-mono"
      >
        Play & Grow
      </button>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-bg-dark border-2 border-primary/30 rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-display font-bold text-primary mb-4">Connect Wallet</h2>
            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setShowModal(false);
                  }}
                  className="w-full btn-primary font-semibold py-3 px-6 rounded-lg transition-colors font-mono text-left"
                >
                  {connector.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-primary/60 hover:text-primary font-mono text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
