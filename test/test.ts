import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { DonationCollection } from "../typechain";

describe("Donation", function () {
    let contract: DonationCollection;
    let owner: SignerWithAddress,
        donater: SignerWithAddress,
        receiver: SignerWithAddress;
    it("deploy", async () => {
        [owner, donater, receiver] = await ethers.getSigners();
        const DonationCollection = await ethers.getContractFactory(
            "DonationCollection"
        );
        contract = await DonationCollection.deploy();
        await contract.deployed();
    });

    it("Donater send ether", async function () {
        await donater.sendTransaction({
            value: ethers.utils.parseEther("1"),
            to: contract.address,
        });

        const arr: string[] = await contract.getDonatsList();
        expect(arr).contains(donater.address);

        expect(await contract.donatList(donater.address)).to.equal(
            ethers.utils.parseEther("1")
        );
    });

    it("Donater can't send 0", async function () {
        await expect(
            donater.sendTransaction({
                value: 0,
                to: contract.address,
            })
        ).to.be.revertedWith("Empty translation");
    });

    it("Only owner can withdraw funds", async function () {
        const amount = ethers.utils.parseEther("1");
        await expect(
            contract
                .connect(donater)
                .withdrawalOfFunds(amount, receiver.address)
        ).to.be.revertedWith("Caller is not owner");
    });

    it("Owner can't withdraw insufficient funds", async function () {
        const amount = ethers.utils.parseEther("2");
        await expect(
            contract.withdrawalOfFunds(amount, receiver.address)
        ).to.be.revertedWith("insufficient funds");
    });

    it("Owner can withdraw funds", async function () {
        const amount = ethers.utils.parseEther("1");

        const prevReceiverBalance = await ethers.provider.getBalance(
            receiver.address
        );

        await contract.withdrawalOfFunds(amount, receiver.address);

        const receiverBalance = await ethers.provider.getBalance(
            receiver.address
        );

        expect(receiverBalance.sub(prevReceiverBalance)).to.equal(
            ethers.utils.parseEther("1")
        );
    });
});
