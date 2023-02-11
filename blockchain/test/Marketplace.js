const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Marketplace", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.


  describe("Create Item", function () {
    it("Create Item successfully", async function () {
            // Contracts are deployed using the first signer/account by default
 // Contracts are deployed using the first signer/account by default
 const [buyer, seller] = await ethers.getSigners();

 const Marketplace = await ethers.getContractFactory("Marketplace");
 const marketplace = await Marketplace.deploy();

 // Check if the item is successfully created
 const tx = await marketplace.CreateItemToSell(100, { from: seller });
 const receipt = await tx.wait();

 // Check if the event ItemCreated is emitted
 const events = receipt.events;
 assert.equal(events.length, 1);
 assert.equal(events[0].event, "ItemCreated");

 // Check if the item has been added to the sellers array
 const sellersArray = await marketplace.sellers();
 assert.equal(sellersArray.length, 1);
 assert.equal(sellersArray[0], seller.address);

 // Check if the item has been added to the userInventory mapping
 const userInventoryArray = await marketplace.userInventory(seller.address);
 assert.equal(userInventoryArray.length, 1);
 assert.equal(userInventoryArray[0].sellPrice, 100);
  })})
});



 