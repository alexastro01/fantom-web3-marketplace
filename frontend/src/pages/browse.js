import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import fantomABI from '../helper/Marketplace.json'
import { useIsMounted } from '@/hooks/useIsMounted';
import { FaCircle } from 'react-icons/fa';
import NftCard from '@/components/profile/NftCard';
import { useContext } from 'react';
import { userAddressContext } from '@/helper/userAddressContext';
import LoadingComponent from '@/components/LoadingComponent'
import { ConnectedContractRead } from '@/hooks/ConnectedContractRead';
const Browse = () => {


  
  const [metadataArr, setMetadataArr] = useState([]);
  const [stateOfArr, setStateOfArr] = useState();
  const {userAddress, setUserAddress} = useContext(userAddressContext)
  const contractToRead = ConnectedContractRead();
 
let arrOfTokenIds = [];

const mounted = useIsMounted();

 const getTokenIds = async () => {
   

   const currentId = await contractToRead.currentId();
   console.log(parseInt(currentId._hex))
   const intCurrentId =parseInt(currentId._hex)
   for(let i = 1; i <= intCurrentId; i ++) {
    arrOfTokenIds.push(i);
    console.log(arrOfTokenIds)

   }

   await getMetadataFromIpfs();
    
  
  
}

const getMetadataFromIpfs = async () => {




 for(let i = 0; i < arrOfTokenIds.length; i++){
   const numberOfId = arrOfTokenIds[i];
     console.log(numberOfId)
      console.log('starting')
     const tokenUri = await contractToRead.tokenURI(parseInt(numberOfId));

 try{
   const config = { headers: {
       
         Accept: "text/plain",
     }}
    
 const metadata = await axios.get(tokenUri, config);
 metadataArr[i] = Object.assign(metadata.data[0], metadata.data[1], metadata.data[2], metadata.data[3], {id: arrOfTokenIds[i]})

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
    console.log(metadataArr)
  }, 500)
},[])





  return (
    <div>
    <Navbar />
    <div className='grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mx-12'>
    {stateOfArr ? 
    
        metadataArr.map(card => (<div><NftCard title={card.title} description={card.description} image={card.image} price={card.price} id={card.id}  metadataArr={metadataArr} isBrowsingPage={true} addressOfUser={userAddress}/></div>)) :
      <div className=''> <LoadingComponent /></div>}
      </div>

    </div>
  )
}

export default Browse