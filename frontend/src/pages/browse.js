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
const Browse = () => {


  
  const [metadataArr, setMetadataArr] = useState([]);
  const [stateOfArr, setStateOfArr] = useState();
  const {userAddress, setUserAddress} = useContext(userAddressContext)
   
 
let arrOfTokenIds = [];

const mounted = useIsMounted();

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
   const currentId = await connectedContract.currentId();
   console.log(parseInt(currentId._hex))
   const intCurrentId =parseInt(currentId._hex)
   for(let i = 1; i <= intCurrentId; i ++) {
    arrOfTokenIds.push(i);
    console.log(arrOfTokenIds)

   }

   await getMetadataFromIpfs();
    
  
  
}

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
    <div className='grid grid-cols-4 mx-12'>
    {stateOfArr ? 
        metadataArr.map(card => (<div><NftCard title={card.title} description={card.description} image={card.image} price={card.price} id={card.id}  metadataArr={metadataArr} isBrowsingPage={true} addressOfUser={userAddress}/></div>)) :
      <div> <LoadingComponent /></div>}
      </div>

    </div>
  )
}

export default Browse