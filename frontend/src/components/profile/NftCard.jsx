import React, { useEffect } from 'react'
import Image from 'next/image'
import { useState } from 'react';
import { ethers } from 'ethers';
import fantomABI from '../../helper/Marketplace.json'
import spinner from '../../images/spinner.gif'
const NftCard = (props) => {

   const[loadingState, setLoadingState] = useState();
   const[sellerofId, setSellerOfId] = useState();
   const[txnHash, setTxnHash] = useState();
   const[buyerOfIdState, setBuyerOfIdState] = useState();
   const[routeOwnsId, setRouteOwnsId] = useState();

   async function forIdGetSeller() {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      signer
    );

    const sellerId = await connectedContract.forIdGetSellerAndPrice(props.id);
    setSellerOfId(sellerId[0])

   }


  async function buyItem() {
    
      
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      );
      setLoadingState(true)
      const buyItem = await connectedContract.BuyItem(props.id, sellerofId, {value: ethers.utils.parseEther(`${props.price}`)});
      setTxnHash(buyItem.hash)
      await buyItem.wait();
      
      console.log('finished!')
      setLoadingState(false)
     
  
  }


  async function getBuyerOfId() {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      signer
    );
    
    const buyerOfId = await connectedContract.buyerOfId(props.id);
    setBuyerOfIdState(buyerOfId)
  }


  async function verifyOwnerShip() {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      signer
    );
    
    const ownerOfId = await connectedContract.ownerOf(props.id);

    
  }

  useEffect(() => {
    forIdGetSeller();
  },[])


  return (
    <div className=' mx-6 my-6 '>
    <div className='p-0 space-y-5  bg-[#F5F5F5]  rounded-t-2xl  drop-shadow-md grid grid-cols-1 justify-items-center min-h-[600px]  '>
    <Image src={props.image} width={400} height={400} className="rounded-lg pt-5 hover:scale-105 transition-transform "/>
     {/* <Image src={props.image} width={400} height={400} className="rounded-lg pt-5 hover:scale-105 transition-transform "/> */}
     <p className="flex justify-center font-semibold text-2xl">{props.title}</p>
     <p className="flex justify-center font-semibold">{props.description}</p>
     <p className="flex justify-center font-semibold text-xl">{props.price} FTM</p>
    
     </div>
     <div className='flex justify-center'>
      {props.ownerOfRoute ?
      <button className='bg-blue-600 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform '>You own this item</button>
     :
     txnHash ?
     <a href={`https://ftmscan.com/tx/${txnHash}`} className='w-full ' target="_blank" >
     <button className='bg-blue-600 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform '>
     View your TXN
     </button>
     </a>
     :
     <button className='bg-blue-600 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform ' onClick={buyItem}>Buy now</button>
     
     
    }
     
     </div>

    </div>
  )
}

export default NftCard