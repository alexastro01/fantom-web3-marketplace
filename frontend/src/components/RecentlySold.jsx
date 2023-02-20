import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { ethers } from 'ethers';
import fantomABI from '../helper/Marketplace.json'
import LandingPageNftEvent from './LandingPageNftEvent';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import LoadingComponent from './LoadingComponent';
import { ConnectedContractRead } from '@/hooks/ConnectedContractRead';

const RecentlySold = () => {

  const [dataForDisplay, setDataForDisplay] = useState([]);
  const [metadataArr, setMetadataArr] = useState([]);
  const [finishedDataProcessing , setFinishedDataProcessing] = useState(0);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };


  const contractToRead = ConnectedContractRead();


    async function callForRecentlySold(){
        const headers = {
          'accept': 'application/json',
          'X-API-Key': `${process.env.NEXT_PUBLIC_MORALIS_API_KEY}`,
          'content-type': 'application/json'
        };
        
        const data ={"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ItemSold","type":"event"};
       try{ 
       const response = await axios.post(
          'https://deep-index.moralis.io/api/v2/0x162A384D5183c6e8A48d5fE0F84109E2d0079A73/events?chain=fantom&from_block=55587828&topic=0xa574c741071bb18f51fa88c17aeefec514bebf670ca22a3736fba6504ecbb763',
          data,
          { headers }
        )

        for (let i = 0; i < 5 ; i ++){
          dataForDisplay.push(response.data.result[i])
        }
       

 
       } catch(e) {
        console.log(e);
       }

      }


      async function getMetadata() {
     
        await callForRecentlySold();
       
        for (let i = 0; i < dataForDisplay.length; i++){
            
        

            const numberOfId = dataForDisplay[i].data._id;
      
            const tokenUri = await contractToRead.tokenURI(numberOfId);
       
            console.log(tokenUri)
           try{
             const config = { headers: {
                 
                   Accept: "text/plain",
               }}
           
              
           const metadata = await axios.get(tokenUri, config);
           console.log(metadata.data);
           metadataArr[i] = Object.assign(metadata.data[0], metadata.data[1], metadata.data[2], metadata.data[3], {id: parseInt(dataForDisplay[i].data._id)}, {buyer: dataForDisplay[i].data.buyer}, {amount: dataForDisplay[i].data.amount} )
           console.log(metadataArr[i])
       
           setFinishedDataProcessing(i)
       
           } catch(e) {
               console.log(e);
           }
         
       
     
        console.log(metadataArr);
     
      }
      }
    
      useEffect(() => {
 
      
          getMetadata();
    
    
      }, [ metadataArr])

  return (

<div className='mx-48 my-12'>
<h1 className='font-light text-4xl mb-8'>Recently Sold</h1>
  {
    finishedDataProcessing > 0 ?
    <Carousel responsive={responsive} >

     {metadataArr.map(card => (
      <LandingPageNftEvent image={card.image} title={card.title} description={card.description} amount={card.amount} id={card.id} address={card.buyer} isSold={true} />
     ))}
  </Carousel>
   : <LoadingComponent />
}
   
</div>
  )
}

export default RecentlySold