import { task, types } from "hardhat/config";

export default task("donater", "task description")
    .addParam("contract", "address of the contract")
    .addParam("address", "donater address")
    .setAction(async (taskArgs, hre) => {
        const contract = await hre.ethers.getContractAt(
            "DonationCollection",
            taskArgs.contract
        );

        const value = await contract.donatList(taskArgs.address);

        console.log(`The address is donater: ${!value.isZero()}`);
    });
