const { revertedWithCustomError } = require("@nomicfoundation/hardhat-chai-matchers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-ethers");


describe("Marketplace", function () {

  let marketplace;
  let Marketplace;
  let creator;
  let buyer;

  beforeEach(async function () {
    creator = await ethers.getSigner();
    buyer = await ethers.getSigner();
     marketplace = await ethers.getContractFactory("Marketplace");
     Marketplace = await marketplace.deploy();

    const itemCreation = await Marketplace.connect(creator).CreateItemToSell(100);
   })

     it("Item creation updates current Id", async function() {
    
      expect(Marketplace.currentId === 1);
     })

     it("Item creation sets approval for contract to move NFTs", async function() {
      expect(Marketplace.isApprovedForAll(creator, Marketplace))
     })

 
});



 