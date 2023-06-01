const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CLAYInTheBlockchainLand = await hre.ethers.getContractFactory("CLAYInTheBlockchainLand");
  const clay = await CLAYInTheBlockchainLand.deploy();
  await clay.deployed();

  console.log("CLAY deployed to:", clay.address);

  const FishInTheBlockchainLand = await hre.ethers.getContractFactory("FishInTheBlockchainLand");
  const fish = await FishInTheBlockchainLand.deploy();
  await fish.deployed();

  console.log("FISH deployed to:", fish.address);

  const RockInTheBlockchainLand = await hre.ethers.getContractFactory("RockInTheBlockchainLand");
  const rock = await RockInTheBlockchainLand.deploy();
  await rock.deployed();

  console.log("ROCK deployed to:", rock.address);

  const WoodInTheBlockchainLand = await hre.ethers.getContractFactory("WoodInTheBlockchainLand");
  const wood = await WoodInTheBlockchainLand.deploy();
  await wood.deployed();

  console.log("WOOD deployed to:", wood.address);

  const WoolInTheBlockchainLand = await hre.ethers.getContractFactory("WoolInTheBlockchainLand");
  const wool = await WoolInTheBlockchainLand.deploy();
  await wool.deployed();

  console.log("WOOL deployed to:", wool.address);

  const tradeOfferFactory = await hre.ethers.getContractFactory("tradeOffer");
  const tradeOffer = await tradeOfferFactory.deploy(
    "0xb41E3ce9A37643d7B4a67f62126468F1C6F70364", // Replace with the actual token1 address
    "0x61D620473acd26cB76C2867860479C9a18e63020", // Replace with the actual token2 address
    "0x17864B7bf61073DF9ED6c0ee90f8117687c2ADe6", // Replace with the actual token3 address
    "0xfE2f637036B869d7F296708BaAd3622c53f0D97D", // Replace with the actual token4 address
    "0x80fF8a9A77F78FC413015068a858F7A56848480A"  // Replace with the actual token5 address
  );
  await tradeOffer.deployed();

  console.log("tradeOffer deployed to:", tradeOffer.address);

  const TokenSwap = await hre.ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwap.deploy(wood.address);
  await tokenSwap.deployed();

  console.log("TokenSwap deployed to:", tokenSwap.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });