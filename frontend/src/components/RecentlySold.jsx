import React from 'react'
import { useEffect } from 'react';
import axios from 'axios';

const RecentlySold = () => {


    async function callForRecentlySold(){
        const headers = {
          'accept': 'application/json',
          'X-API-Key': `${process.env.NEXT_PUBLIC_MORALIS_API_KEY}`,
          'content-type': 'application/json'
        };
        
        const data ={"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"_id","type":"uint256"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ItemSold","type":"event"};
        
        axios.post(
          'https://deep-index.moralis.io/api/v2/0x2853CB399033447AAf3A14c8c4bC41Be43c0856e/events?chain=fantom&from_block=55587828&topic=0xa574c741071bb18f51fa88c17aeefec514bebf670ca22a3736fba6504ecbb763',
          data,
          { headers }
        )
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.error(error);
        });
      }
    
      useEffect(() => {
        callForRecentlySold();
      }, [])

  return (

    <div>
    <div className='grid grid-cols-4 justify-items-center '>
         <div className=''>
         recentlySold
         </div>
         <div>
         recentlySold
         </div>
         <div>
         recentlySold
         </div>
         <div>
         recentlySold
         </div>
    </div>
    <div>
 
    </div>
</div>
  )
}

export default RecentlySold