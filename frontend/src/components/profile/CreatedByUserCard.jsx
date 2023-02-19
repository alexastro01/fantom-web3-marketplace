import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useIsMounted } from '@/hooks/useIsMounted';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { ethers } from "ethers";
import fantomABI from '../../helper/Marketplace.json'
import NftCard from './NftCard';
import { FaCircle } from 'react-icons/fa';


const CreatedByUserCard = (props) => {


     const [metadataArr, setMetadataArr] = useState([]);
     const [stateOfArr, setStateOfArr] = useState();
     const [cycleState, setCycleState] = useState(false)
      
    
let arrOfTokenIds = [];


    const getTokenIds = async () => {
      
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom/');
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        provider
      )
      const tokenIDs = await connectedContract.getItemIdsCreatedByUser(props.routeWallet);
      for(let i =0; i <tokenIDs.length; i ++) {
      const hex = tokenIDs[i]._hex
     
      const hexNumber = hex;

      console.log(hexNumber)
      arrOfTokenIds.push(hexNumber);
      console.log(arrOfTokenIds)
      }

      await getMetadataFromIpfs();
       
     
     
  }

const mounted = useIsMounted();

  const getMetadataFromIpfs = async () => {

    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
        const { ethereum } = window;
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom/');
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          fantomABI,
          provider
        )

    for(let i = 0; i < arrOfTokenIds.length; i++){
     const numberOfId = arrOfTokenIds[i];
     console.log(numberOfId)
      console.log('starting')
     const tokenUri = await connectedContract.tokenURI(parseInt(numberOfId));

     console.log(tokenUri)
    try{
      const config = { headers: {
          
            Accept: "text/plain",
        }}
       
    const metadata = await axios.get(tokenUri, config);

    
    metadataArr[i] = Object.assign(metadata.data[0], metadata.data[1], metadata.data[2], metadata.data[3], {id: parseInt(numberOfId)})

    console.log(metadataArr);

    } catch(e) {
        console.log(e);
    }
  
   }

   setStateOfArr(true);

}

    
      
  
    
      useEffect(() => {
      setTimeout(() => {

        getTokenIds();
      }, 500)  
      setCycleState(true);
      console.log(props.routeWallet + 'this is route state')
       
      }, [props.routeWallet, metadataArr, props, props.addressOfUser])

        
      return (
    <div>  
      
      <div className='grid grid-cols-4'>
        {mounted ? 
        metadataArr.map(card => (<div><NftCard title={card.title} description={card.description} image={card.image} price={card.price} ownerOfRoute={props.booleanOwnerOfRoute} id={card.id} routeWallet={props.routeWallet}  addressOfUser={props.addressOfUser} metadataArr={metadataArr} stateOfPage={props.stateOfPage}/></div>)) :
      <div> <FaCircle /></div>}

      </div>

    </div>
      )
    }

export default CreatedByUserCard