import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DiaryToken to Base Sepolia...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy DiaryToken
  const DiaryToken = await ethers.getContractFactory("DiaryToken");
  const diaryToken = await DiaryToken.deploy();
  await diaryToken.waitForDeployment();

  const address = await diaryToken.getAddress();
  console.log("\n✅ DiaryToken deployed to:", address);
  console.log("\nAdd this to your .env.local:");
  console.log(`NEXT_PUBLIC_DIARY_TOKEN_ADDRESS=${address}`);
  console.log(`\nOwner address: ${deployer.address}`);
  console.log("\n🔗 View on Basescan:");
  console.log(`https://sepolia.basescan.org/address/${address}`);

  // Wait for block confirmations before verification
  console.log("\nWaiting for block confirmations...");
  await diaryToken.deploymentTransaction()?.wait(5);

  console.log("\n✅ Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
