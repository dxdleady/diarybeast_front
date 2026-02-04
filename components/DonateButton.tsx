'use client';

import { useState } from 'react';

const DONATE_ADDRESS =
  process.env.NEXT_PUBLIC_DONATE_ADDRESS || '0x0000000000000000000000000000000000000000';
const GOAL_USD = 300_000;

export default function DonateButton() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(DONATE_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-green-800 p-4 text-center">
      <div className="text-green-500 text-sm mb-2">Fund the future of AI pets</div>
      <div className="text-green-700 text-xs mb-3">
        Goal: ${GOAL_USD.toLocaleString()} — building next-gen Tamagotchi products
      </div>

      <div className="flex flex-col gap-2 items-center">
        <button
          onClick={copyAddress}
          className="px-4 py-2 border border-green-600 text-green-400 hover:bg-green-900/30 transition-colors text-sm"
        >
          {copied ? 'Copied!' : 'Donate ETH / USDC on Base'}
        </button>
        <span className="text-green-800 text-xs font-mono break-all max-w-xs">
          {DONATE_ADDRESS.slice(0, 10)}...{DONATE_ADDRESS.slice(-8)}
        </span>
      </div>
    </div>
  );
}
