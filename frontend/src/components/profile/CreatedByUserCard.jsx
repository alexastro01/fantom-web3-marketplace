import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { useIsMounted } from '@/hooks/useIsMounted';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { ethers } from "ethers";
import fantomABI from '../../helper/Marketplace.json'



const CreatedByUserCard = (props) => {


     const [eventsData, setEventsData] = useState([]);
     const [tokenUriData, setTokenUriData] = useState([]);
     const [stateOfArray, setstateOfArray] = useState(false);
      
    
let arrOfTokenIds = [];


    const getTokenIds = async () => {
      
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      );
      const tokenIDs = await connectedContract.getItemIdsCreatedByUser(props.routeWallet);
      for(let i =0; i <tokenIDs.length; i ++) {
      const hex = tokenIDs[i]._hex
      const hexNumber = hex.substring(3);

      console.log(hexNumber)
      arrOfTokenIds.push(hexNumber);
      console.log(arrOfTokenIds)
      }
       
     
     
  }

  const getMetadataFromIpfs = async () => {
    for(let i = 0; i < eventsData.length; i++){
    if(eventsData[i].metadata.startsWith('https://gateway.pinata.cloud/ipfs')){
    try{
      const config = { headers: {
          
            Accept: "text/plain",
        }}
       
    const metadata = await axios.get(eventsData[i].metadata, config);
    console.log(metadata.data[0]);
    
   eventsData[i] = Object.assign(eventsData[i], metadata.data[0], metadata.data[3], metadata.data[1], metadata.data[2])
  

    } catch(e) {
        console.log(e);
    }
  } else {
    console.log('not valid metadata link')
  }
}
console.log(eventsData)
}

    
      
  
    
      useEffect(() => {
      setTimeout(() => {

        getTokenIds();
      }, 500)  
       
      }, [props.routeWallet, eventsData, props])

        
      return (
    <div>

    </div>
      )
    }

export default CreatedByUserCard