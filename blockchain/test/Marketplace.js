const { revertedWithCustomError } = require("@nomicfoundation/hardhat-chai-matchers");
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
require("@nomiclabs/hardhat-ethers");


describe("Item Creation Marketplace", function () {

  let marketplace;
  let Marketplace;
  let creator;
  let buyer;
  let price;
  beforeEach(async function () {
    creator = await ethers.getSigner();
    buyer = await ethers.getSigner();
     marketplace = await ethers.getContractFactory("Marketplace");
     Marketplace = await marketplace.deploy();
     price = 100;
    const itemCreation = await Marketplace.connect(creator).CreateItemToSell(price , "");
   })

     it("Item creation updates current Id", async function() {
      const currentId = await Marketplace.currentId();
     const currentIdNumber = currentId.toNumber()
      assert(currentIdNumber === 1);
     })

     it("Item creation sets approval for contract to move NFTs", async function() {
      const isApprovedForAll = await Marketplace.isApprovedForAll(creator.address, Marketplace.address)
      assert(isApprovedForAll === true);
     })

     it("Should update creator inventory", async function() {
     const currentId = await Marketplace.currentId();
     const currentIdNumber = currentId.toNumber()
     const userInventory = await Marketplace.userInventory(creator.address, currentIdNumber)
     const userInventoryNumber = userInventory.toNumber();
       
      assert(userInventoryNumber === price );
     })
  
     it("Should update creator balance", async function() {
      const balanceOfCreator = await Marketplace.balanceOf(creator.address);

      assert(balanceOfCreator != 0);
      
     })

     it("Should update the sellers array", async function() {
      let arr = [];
      const sellersArray = await Marketplace.sellers(0);
      arr.push(sellersArray)
      assert(arr.includes(creator.address));

     });

     it("Should initialize soldStatus mapping", async function() {
      const currentIdBigNumber = await Marketplace.currentId()
      const currentId = currentIdBigNumber.toNumber();
      const soldStatus = await Marketplace.SoldStatus(currentId)
      assert(soldStatus === false);
      })

    
     
});


describe("Buying Item on Marketplace", function () {

  let marketplace;
  let Marketplace;
  let creator;
  let buyer;
  let anotherPerson;
  let price;
  beforeEach(async function () {
    // creator = await ethers.getSigner();
  
    // buyer = await ethers.getSigner();
    // anotherPerson = await ethers.getSigner();
    [creator, buyer, anotherPerson] = await ethers.getSigners();
     marketplace = await ethers.getContractFactory("Marketplace");
     Marketplace = await marketplace.deploy();
     price = 100;
    const itemCreation = await Marketplace.connect(creator).CreateItemToSell(price, "");
    const itemBought = await Marketplace.connect(buyer).BuyItem(1, creator.address, { value: price })
   
   })

     it("Should Transfer the NFT to the buyer", async function() {

       const balanceOfbuyer = await Marketplace.balanceOf(buyer.address);
       const balanceOfBuyerNumber = balanceOfbuyer.toNumber();
       assert(balanceOfBuyerNumber === 1);
     
     });


    it("Should update order status", async function() {
       const orderStatus = await Marketplace.orderStatus(1)
     
       assert(orderStatus === 1);
    })
     
    it("Should update balance of seller" , async function() {
      const balanceOfSeller = await Marketplace.balanceUser(creator.address);
      const balanceSellerNumber = balanceOfSeller.toNumber();
      assert(balanceSellerNumber === 100);
    })

    it("Should update buyer of id", async function() {
      const buyerOfId = await Marketplace.buyerOfId(1)
      assert(buyerOfId === buyer.address);
   })


     it("only owner can withdrawMarketplace", async function() {
     
      
     await expect(Marketplace.connect(anotherPerson).withDrawMarketplace()).to.be.revertedWith('Ownable: caller is not the owner')
     })

     it("only seller can withdraw his amount", async function() {
     
      
      await expect(Marketplace.connect(anotherPerson).withDrawSeller()).to.be.revertedWith('Required to have funds');
      })
    
      it("seller can withdraw his amount", async function() {
       const withdrawl = await Marketplace.connect(creator).withDrawSeller()
      assert(withdrawl)
      })

      it("only seller can update his shippment status", async function() {
       await expect(Marketplace.connect(anotherPerson).updateShipmentStatus(1)).to.be.revertedWith("user doesn't own the item")

      })
});



 