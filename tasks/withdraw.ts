import { task, types } from "hardhat/config";

export default task("withdraw", "description")
    .addParam("contract", "address of the contract")
    .addParam("amount", "Enable automine")
    .addParam("receiver", "Enable automine")
    .setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt(
            "DonationCollection",
            taskArgs.contract
        );

        await contract.withdrawalOfFunds(
            taskArgs.amount,
            hre.ethers.utils.parseEther(taskArgs.receiver).toString()
        );
    });
