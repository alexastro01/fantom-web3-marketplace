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
import LoadingComponent from '../LoadingComponent';
import { ConnectedContractRead } from '@/hooks/ConnectedContractRead';

const CreatedByUserCard = (props) => {


     const [metadataArr, setMetadataArr] = useState([]);
     const [stateOfArr, setStateOfArr] = useState(false);
     const [cycleState, setCycleState] = useState(false)
      
    
let arrOfTokenIds = [];

const contractToRead = ConnectedContractRead();


    const getTokenIds = async () => {
      
  
      const tokenIDs = await contractToRead.getItemIdsCreatedByUser(props.routeWallet);
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


    for(let i = 0; i < arrOfTokenIds.length; i++){
     const numberOfId = arrOfTokenIds[i];
     console.log(numberOfId)
      console.log('starting')
     const tokenUri = await contractToRead.tokenURI(parseInt(numberOfId));

     console.log(tokenUri)
    try{
      const config = { headers: {
          
            Accept: "text/plain",
        }}
        let newGatewayUrl = tokenUri.replace('https://gateway.pinata.cloud/ipfs', 'https://gateway.pinata.cloud/ipfs')   
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
      
      <div className='grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {mounted && stateOfArr ? 
        metadataArr.map(card => (<div><NftCard title={card.title} description={card.description} image={card.image} price={card.price} ownerOfRoute={props.booleanOwnerOfRoute} id={card.id} routeWallet={props.routeWallet} stateOfArr={props.stateOfArr}  addressOfUser={props.addressOfUser} metadataArr={metadataArr} stateOfPage={props.stateOfPage} created={true}/></div>)) :
      <div> <LoadingComponent /></div>}

      </div>

    </div>
      )
    }

export default CreatedByUserCard