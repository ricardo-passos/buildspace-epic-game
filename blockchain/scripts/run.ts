import { ethers } from "hardhat";

async function main() {
  const GameContractInstance = await ethers.getContractFactory("EpicGame");

  const gameContract = await (
    await GameContractInstance.deploy(
      ["Anderson", "Filipe", "Paulo"],
      [
        "https://cdn.discordapp.com/avatars/925002391479283713/74150764c2151df157fdde1718dba14b.webp?size=128",
        "https://cdn.discordapp.com/avatars/335194385224564757/942292a0b5000bd757fbae7b79dbea13.webp?size=128",
        "https://cdn.discordapp.com/avatars/680792646016434177/f9456a07c432042e299486fa8b891f45.webp?size=128",
      ],
      [100, 200, 300],
      [100, 50, 25],
      "Renato Preti",
      "https://i.imgur.com/nZrEApe.jpg",
      10_0000,
      50
    )
  ).deployed();

  console.log("Contract deployed at: ", gameContract.address);

  await (await gameContract.functions.mintCharacterNFT(0)).wait();

  const returnedTokenUri = await gameContract.tokenURI(1);
  console.log("Token URI:", returnedTokenUri);

  await (await gameContract.functions.attackBoss()).wait();
  await (await gameContract.functions.attackBoss()).wait();
  await (await gameContract.functions.attackBoss()).wait();
}

main().catch((err) => {
  console.log({ err });
});
