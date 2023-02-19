import React, { useEffect } from 'react'
import Image from 'next/image'
import { useState } from 'react';
import { ethers } from 'ethers';
import fantomABI from '../../helper/Marketplace.json'
import spinner from '../../images/spinner.gif'
import { useRouter } from 'next/router';
import { useIsMounted } from '@/hooks/useIsMounted';
const NftCard = (props) => {

   const[loadingState, setLoadingState] = useState();
   const[sellerofId, setSellerOfId] = useState();
   const[txnHash, setTxnHash] = useState();
   const[buyerOfIdState, setBuyerOfIdState] = useState();
   const[routeOwnsId, setRouteOwnsId] = useState();
   const[ownerOfIdState, setOwnerOfIdState] = useState();
   const[soldStatusState, setSoldStatusState] = useState();
   const[propsState, setPropsState] = useState(props);
   const[shippingStatusState, setShippingStatusState] = useState();
   const[cycleState, setCycleState] = useState(false);

   const mappingOfOrderStatus = {
    0: 'Order Not Active',
    1: 'Order Received',
    2: 'Shipping in Progress',
    3: 'Shipped'
   }


  async function updateOrderStatus() {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      signer
    );

    const shippingStatus = await connectedContract.updateShipmentStatus(props.id);
    
    await getShippingStatus();
  }


  async function finalizeOrder() {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      signer
    );

    const shippingStatus = await connectedContract.finalizeOrder(props.id);
    
    await getShippingStatus();
  }

   async function getShippingStatus () {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      signer
    );

    const shippingStatus = await connectedContract.getShipmentStatusForId(props.id);
    console.log(shippingStatus)
    setShippingStatusState(shippingStatus)
  
   }

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

    console.log(props.id)

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
    console.log(props.id + "this is props.id")
    const buyerOfId = await connectedContract.buyerOfId(props.id);
    console.log(buyerOfId + "this is buyerOfId")
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
    console.log(ownerOfId)
    setOwnerOfIdState(ownerOfId)
    if(ownerOfId == props.routeWallet) {
      
      setRouteOwnsId(true);
    } else {
      setRouteOwnsId(false);
      await getBuyerOfId();
    }
    console.log(routeOwnsId)
    console.log(ownerOfId + " " + "owner of id and props.routewallet" + " " + props.routeWallet)
    
  }

  async function checkIfItemwasBought () {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      signer
    );
    
    const soldStatus = await connectedContract.SoldStatus(props.id);
    console.log(soldStatus + " " +"soldstatus")
    if(soldStatus == true) {
      setSoldStatusState(true)
    } else if (soldStatus == false) {
    setSoldStatusState(false)
    }
  }

  
const mounted = useIsMounted();
  useEffect(() => {
    setCycleState(false);
    forIdGetSeller();
    verifyOwnerShip();
    checkIfItemwasBought();
    setCycleState(true);
    console.log(props.stateOfPage + "this is state of page")
    getShippingStatus();    

  },[props.routeWallet, props.metadataArr, loadingState, props, props.stateOfPage, shippingStatusState])


  return (
    
    <div className=' mx-6 my-6 '>
       
    <div className='p-0 space-y-3  bg-[#F5F5F5]  rounded-t-2xl  drop-shadow-md grid grid-cols-1 justify-items-center min-h-[600px]  '>
     <div className='w-[350px] h-[350px] grid items-center  justify-items-center'>
    <Image src={propsState.image} width={300} height={300} className="rounded-lg pt-5 hover:scale-105 transition-transform  "/>
    </div>
     {/* <Image src={props.image} width={400} height={400} className="rounded-lg pt-5 hover:scale-105 transition-transform "/> */}
     
     <p className="flex justify-center font-semibold text-2xl">{propsState.title}</p>
     {shippingStatusState > 0 && <p className="flex justify-center font-semibold text-md">Status : {mappingOfOrderStatus[shippingStatusState]}</p>}
     <p className="  font-semibold text-center">{propsState.description}</p>
    
     <p className="flex justify-center font-semibold text-xl">{propsState.price} FTM</p>
      
     </div>
     <div className='flex justify-center'>
       {
        props.stateOfPage === 1 && props.ownerOfRoute == true  && soldStatusState == true && 
        <button className='bg-[#2590EB] text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform ' 
        onClick={shippingStatusState < 2 ? updateOrderStatus : finalizeOrder } >
          Update Order Status
          </button>
       }
     </div>
     <div className='flex justify-center'>
      {
     loadingState  ?
     <a href={`https://ftmscan.com/tx/${txnHash}`} className='w-full ' target="_blank" >
      <button className='bg-gray-800 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform '>
      {!txnHash ? 'Initializing txn...' : 'View your txn'}
    </button>
    </a>

    :
     propsState.addressOfUser == ownerOfIdState
     ?
    <button className='bg-gray-800 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform '>You own this item</button>
     :
     soldStatusState ?
     <button className='bg-gray-800 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform ' >{props.stateOfPage === 1 ? 'Sold to ' + " " + buyerOfIdState : 'Sold to ' + " " + props.routeWallet }</button>
     
     :
     <button className='bg-[#2590EB] text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform ' onClick={buyItem}>Buy now</button>
     
     
    //  routeOwnsId ?
      
    //   <button className='bg-gray-800 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform '>You own this item</button>
    //  :
    //  txnHash ?
    //  <a href={`https://ftmscan.com/tx/${txnHash}`} className='w-full ' target="_blank" >
    //  <button className='bg-gray-800 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform '>
    //  View your TXN
    //  </button>
    //  </a>
    //  :
    //  props.addressOfUser == ownerOfIdState ?
    //  <button className='bg-gray-800 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform ' >You bought this item</button>
    //  :
    //  <button className='bg-gray-800 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform ' onClick={buyItem}>Buy now</button>
     
   
     
    }


    

     
     </div>
    </div>
  )
}

export default NftCard