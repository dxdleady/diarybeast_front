# Wallet Setup Guide

## Supported Wallets

DiaryBeast supports multiple wallet types for easy onboarding:

### 1. Coinbase Smart Wallet (Recommended)

**Why use it:**
- ✅ Easiest for beginners
- ✅ Gasless transactions on Base
- ✅ Social recovery (no seed phrase needed)
- ✅ Built-in on-ramp (buy crypto with card)
- ✅ Works seamlessly with Base network

**How to set up:**
1. Visit [wallet.coinbase.com](https://wallet.coinbase.com)
2. Click "Create new wallet"
3. Choose your recovery method (email, phone, or existing Coinbase account)
4. Your wallet is ready!

**On DiaryBeast:**
- Click "Play & Grow"
- Select "Coinbase Wallet" from the modal
- Follow prompts to connect
- Sign the authentication message

### 2. MetaMask

**Why use it:**
- ✅ Most popular wallet
- ✅ Works across many chains
- ✅ Browser extension available
- ✅ Mobile app available

**How to set up:**
1. Install MetaMask extension from [metamask.io](https://metamask.io)
2. Create new wallet or import existing
3. Secure your seed phrase

**Adding Base Sepolia Network:**
```
Network Name: Base Sepolia
RPC URL: https://sepolia.base.org
Chain ID: 84532
Currency Symbol: ETH
Block Explorer: https://sepolia.basescan.org
```

**On DiaryBeast:**
- Click "Play & Grow"
- Select "Injected" from the modal
- Choose MetaMask when prompted
- Switch to Base Sepolia network if needed
- Sign the authentication message

### 3. Phantom

**Why use it:**
- ✅ Clean, modern interface
- ✅ Multi-chain support
- ✅ Mobile and browser extension

**How to set up:**
1. Install Phantom from [phantom.app](https://phantom.app)
2. Create new wallet
3. Secure your seed phrase
4. Enable Ethereum/Base support in settings

**On DiaryBeast:**
- Click "Play & Grow"
- Select "Injected" from the modal
- Choose Phantom when prompted
- Sign the authentication message

### 4. Rainbow Wallet

**Why use it:**
- ✅ Beginner-friendly
- ✅ Beautiful design
- ✅ NFT gallery built-in

**Setup similar to MetaMask** - install extension, create wallet, add Base Sepolia network.

## Getting Test ETH for Base Sepolia

To interact with DiaryBeast on testnet, you need test ETH for gas:

1. **Alchemy Faucet** (Recommended)
   - Visit [alchemy.com/faucets/base-sepolia](https://www.alchemy.com/faucets/base-sepolia)
   - Connect your wallet
   - Request test ETH (0.1 ETH per day)

2. **Coinbase Faucet**
   - [coinbase.com/faucets](https://coinbase.com/faucets)
   - Requires Coinbase account

3. **LearnWeb3 Faucet**
   - [learnweb3.io/faucets](https://learnweb3.io/faucets)

## Basenames (Optional)

Basenames are human-readable names for your wallet (like ENS).

### What is a Basename?
Instead of `0x1234...5678`, your profile shows `yourname.base.eth`

### How to get one:
1. Visit [base.org/names](https://base.org/names)
2. Search for available name
3. Register on **Base Mainnet** (costs ~$5-10 in ETH)
4. Your Basename will automatically appear in DiaryBeast

### Important Notes:
- Basenames only exist on **Base Mainnet**, not Sepolia testnet
- DiaryBeast queries mainnet for your name while using Sepolia for transactions
- You can use the app without a Basename (wallet address shows instead)

## Wallet Connection Flow

1. **Connect Wallet**
   - Click "Play & Grow" on homepage
   - Choose wallet from modal
   - Approve connection in wallet popup

2. **Sign Authentication Message**
   - After connecting, click "Sign In"
   - Your wallet will show a signature request
   - Message: "Sign this message to authenticate with DiaryBeast"
   - Click "Sign" (this is free, no gas needed)

3. **Welcome!**
   - New users receive 50 DIARY tokens automatically
   - Start your journaling journey!

## Disconnecting

To disconnect your wallet:
1. Click "Exit" in the bottom navigation menu
2. Wallet disconnects and you return to homepage
3. Next time, choose any wallet you prefer

## Troubleshooting

### Signature modal doesn't appear
- **Solution 1**: Check if popup was blocked by browser
- **Solution 2**: Try a different wallet (Injected instead of Smart Wallet)
- **Solution 3**: Refresh page and try again

### Wrong network
- **Solution**: Switch to Base Sepolia in your wallet settings
- MetaMask: Click network dropdown → Select Base Sepolia (or add it manually)

### Transaction fails
- **Cause**: Not enough test ETH for gas
- **Solution**: Get test ETH from faucets (see above)

### Basename not showing
- **Expected behavior**: Basenames only on mainnet, not testnet
- **Solution**: Register on Base Mainnet at base.org/names

## Security Best Practices

1. **Never share your seed phrase** - Nobody from DiaryBeast will ever ask for it
2. **Verify the website** - Always check you're on the correct URL
3. **Check signature messages** - Only sign messages you understand
4. **Use hardware wallet** - For large amounts (optional for testnet)
5. **Keep backups** - Write down seed phrase and store securely

## FAQ

**Q: Which wallet should I use?**
A: Coinbase Smart Wallet for easiest experience, MetaMask if you're experienced with crypto.

**Q: Do I need real money?**
A: No! DiaryBeast runs on Base Sepolia testnet. Use free test ETH from faucets.

**Q: Can I switch wallets?**
A: Yes! Click "Exit", disconnect, then "Play & Grow" to choose a different wallet.

**Q: Why do I need to sign a message?**
A: This proves you own the wallet address, allowing secure authentication without passwords.

**Q: Where are my DIARY tokens stored?**
A: On Base Sepolia blockchain, tied to your wallet address. You own them!

**Q: Can I transfer DIARY tokens to someone else?**
A: No, DIARY tokens are "soul-bound" - they stay with your wallet permanently.

## Support

Need help? Check the [Getting Started](./Getting%20Started.md) guide or [Blockchain Integration](./Blockchain%20Integration/) documentation.
