import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { ethers } from 'ethers';
import fantomABI from '../helper/Marketplace.json'
import LandingPageNftEvent from './LandingPageNftEvent';
import Carousel from 'react-multi-carousel';
import LoadingComponent from './LoadingComponent';
import 'react-multi-carousel/lib/styles.css';
import { ConnectedContractRead } from '@/hooks/ConnectedContractRead';

const RecentlyCreated = () => {

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
        
        const data ={"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"}],"name":"ItemCreated","type":"event"};
       try{ 
       const response = await axios.post(
          'https://deep-index.moralis.io/api/v2/0x84EDAf725e649D0034348f345eBAA05624566861/events?chain=fantom&from_block=55587828&topic=0x9b8c4b5bf2f39369bee0a581bf2e28b1c1df1982925a012ff839ee598d142cdd',
          data,
          { headers }
        )

        for (let i = 0; i < 5 ; i ++){
          console.log(response.data)
          dataForDisplay.push(response.data.result[i])
        }
       

 
       } catch(e) {
        console.log(e);
       }

      }


      async function getMetadata() {
  
        await callForRecentlySold();
       
        for (let i = 0; i < dataForDisplay.length; i++){
            console.log(dataForDisplay[i])
        

            const numberOfId = dataForDisplay[i].data._id;
      
            const tokenUri = await contractToRead.tokenURI(numberOfId);
       
            console.log(tokenUri)
           try{
             const config = { headers: {
                 
                   Accept: "text/plain",
               }}
           
              
           const metadata = await axios.get(tokenUri, config);
           console.log(metadata.data);
           metadataArr[i] = Object.assign(metadata.data[0], metadata.data[1], metadata.data[2], metadata.data[3], {id: parseInt(dataForDisplay[i].data._id)}, {seller: dataForDisplay[i].data.seller}, {amount: dataForDisplay[i].data.amount} )
           console.log('in recently created')
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

<div className='mx-12 xl:mx-24 2xl:mx-48 my-12'>
  <h1 className='font-light text-4xl mb-8'>Recently Created</h1>
  {
    finishedDataProcessing > 0 ?
    <Carousel responsive={responsive}    >

     {metadataArr.map(card => (
      <LandingPageNftEvent image={card.image} title={card.title} description={card.description} amount={card.price} id={card.id} address={card.seller} />
     ))}
  </Carousel>
   : <LoadingComponent />

}
   
</div>
  )
}

export default RecentlyCreated