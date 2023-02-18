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
      
    
let initialArr = [];


   async function filterData(arg) {
        console.log(arg + " " + "this is props")
      
            for(let i = 0; i < initialArr.length; i++) {
                if(arg.toLowerCase() == initialArr[i].seller.toLowerCase()) {
                    eventsData.push(initialArr[i]);
                console.log("this is user events")
                setstateOfArray(true)
                } else {
                  console.log('fail')
                }
        }

       await MetadataCall();
       await getMetadataFromIpfs();
    }

    const MetadataCall = async () => {
      
      const CONTRACT_ADDRESS = "0x2853CB399033447AAf3A14c8c4bC41Be43c0856e";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      );
     
      for(let i = 0; i < eventsData.length; i++) {
        console.log(eventsData.length)
      const tokenURI = await connectedContract.tokenURI(eventsData[i]._id);
      eventsData[i] = Object.assign(eventsData[i], {metadata: tokenURI})
       console.log(eventsData)
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

    async function callForRecentlyCreated(){
        const headers = {
          'accept': 'application/json',
          'X-API-Key': `${process.env.NEXT_PUBLIC_MORALIS_API_KEY}`,
          'content-type': 'application/json'
        };
        
        const data ={"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":true,"internalType":"address","name":"seller","type":"address"}],"name":"ItemCreated","type":"event"};
        
       await axios.post(
          'https://deep-index.moralis.io/api/v2/0x162A384D5183c6e8A48d5fE0F84109E2d0079A73/events?chain=fantom&from_block=55587828&topic=0x1c78b9707d8ddf8078f46413765b0e73d250ffc795526eeb39c6889ea8efafd0',
          data,
          { headers }
        )
        .then(response => {
         
            for (let i = 0; i < response.data.result.length; i++) {
            initialArr.push(response.data.result[i].data);
            console.log(initialArr)
            }
            
            filterData(props.routeWallet)
        
        })
        .catch(error => {
          console.error(error);
        });
      }
      
  
    
      useEffect(() => {
      setTimeout(() => {
        callForRecentlyCreated();
        console.log(props.routeWallet + " " + "this is in useEffect")
     
      }, 500)  
       
      }, [props.routeWallet, eventsData, props])

        
      return (
        <div>
          {stateOfArray ? eventsData.map(event => (
          <div>
            <p>{event.seller}</p>
            <p>{event._id}</p>
         </div>
        )) : <div>null</div>}
          
            <div>
         
            </div>
        </div>
      )
    }

export default CreatedByUserCard