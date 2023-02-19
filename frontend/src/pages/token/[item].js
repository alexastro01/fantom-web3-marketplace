import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { userAddressContext } from "@/helper/userAddressContext";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";
import fantomABI from '../../helper/Marketplace.json'
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import TokenInfoComponent from "@/components/TokenInfoComponent";

export default function Item() { 
  

    const {userAddress, setUserAddress} = useContext(userAddressContext);
    const [tokenRouteState, setTokenRouteState] = useState('');
    const [metadataLinkState, setMetadataLinkState] = useState();
    const [arrayState, setArrayState] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [ownerOfState, setOwnerOfState] = useState();
    const [sellerState, setSellerState] = useState();
    const [soldStatusState, setSoldStatusState] = useState();
    const [buyerOfIdState, setBuyerOfIdState] = useState('');
    const [buySuccess, setBuySuccess] = useState();
    const [loadingState, setLoadingState] = useState();
    const [priceState, setPriceState] = useState();
    const [txnHash, setTxnHash] = useState();
    const router = useRouter();
    const pathArray = router.asPath.split('/');
    const tokenIdRoute = pathArray[2];



    const forIdGetSeller = async () => {
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      );
      if(tokenIdRoute >= 0) {
      const sellerandId = await connectedContract.forIdGetSellerAndPrice(tokenIdRoute);
      console.log(sellerandId)
      const seller = sellerandId[0];
      setSellerState(seller)
      const price = sellerandId[1];
      console.log(price._hex)
      const priceset = parseInt(price._hex)
      const pricetoeth = ethers.utils.formatEther(price._hex)
      console.log("priceeee" + " " + pricetoeth)
      setPriceState(pricetoeth)
      
      
      ;
      
      }
    }


    const getOwnerOfId = async () => {
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      );
      if(tokenIdRoute >= 0) {
      const ownerOf = await connectedContract.ownerOf(tokenIdRoute);
      console.log(ownerOf)
      setOwnerOfState(ownerOf)
      }
    }

    const MetadataCall = async () => {
      
        const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          fantomABI,
          signer
        );
        if(tokenIdRoute >= 0) {
        const tokenURI = await connectedContract.tokenURI(tokenIdRoute);
        console.log(tokenURI)
        setMetadataLinkState(tokenURI)
        await getMetadataFromIpfs();
        }
    }

    const getMetadataFromIpfs = async () => {
        if(metadataLinkState){
        try{
          const config = { headers: {
              
                Accept: "text/plain",
            }}
            console.log(metadataLinkState)
        const metadata = await axios.get(metadataLinkState, config);
        console.log(metadata);
        
        metadata.data.forEach(element => arrayState.push(element))

        console.log(arrayState);
        setIsLoading(false);
        } catch(e) {
            console.log(e);
        }
    }
    }


    const getSoldStatus = async () => {
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      );
      if(tokenIdRoute >= 0) {
      const soldStatus = await connectedContract.SoldStatus(tokenIdRoute);
      console.log(soldStatus)
      setSoldStatusState(soldStatus)
      }
    }


    const getBuyerOfId = async () => {
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      );
      if(tokenIdRoute >= 0) {
      const buyerOfId = await connectedContract.buyerOfId(tokenIdRoute);
      console.log(buyerOfId)
      setBuyerOfIdState(buyerOfId)
      }
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
    const buyItem = await connectedContract.BuyItem(tokenIdRoute, sellerState, {value: ethers.utils.parseEther(`${priceState}`)});
    setTxnHash(buyItem.hash)
    await buyItem.wait();
    
    console.log('finished!')
    await getBuyerOfId();
    setLoadingState(false)
    setBuySuccess(true);
   

}

    const RenderMethod = () => {
     if(soldStatusState) {
      if(buyerOfIdState == userAddress) {
        return (
          <div className="ml-auto">
           <button className='bg-[#2590EB] text-white font-bold  w-48 rounded-lg  h-10 hover:scale-105 transition-transform ' onClick={null}>{'You bought this item'}</button>
          </div>
        )
      } else if (buyerOfIdState != userAddress) {
        return (
        <div className="ml-auto">
          <Link href={`../profile/${buyerOfIdState}`} >
        <button className='bg-gray-800 text-white font-bold  w-48 rounded-lg  h-10 hover:scale-105 transition-transform ' onClick={null}>Sold to {buyerOfIdState.startsWith('0x') && buyerOfIdState.slice(0,7)}</button>
        </Link>
       </div>
        )
      }
    } else  {
      if(ownerOfState == userAddress) {
        return (
          <div className="ml-auto">
          <button className='bg-[#2590EB] text-white font-bold  w-48 rounded-lg  h-10 hover:scale-105 transition-transform ' onClick={null}>{'Listed by you'}</button>
         </div>
        )
      } else {
        return (
          <div className="ml-auto">
            { 
     loadingState  ?
     <a href={`https://ftmscan.com/tx/${txnHash}`} className='w-full ' target="_blank" >
      <button className='bg-gray-800  text-white font-bold  w-48 rounded-lg  h-10 hover:scale-105 transition-transform'>
      {!txnHash ? 'Initializing txn...' : 'View your txn'}
    </button>
    </a> : <button className='bg-[#2590EB] text-white font-bold  w-48 rounded-lg  h-10 hover:scale-105 transition-transform' onClick={buySuccess ? null : buyItem}>{buySuccess ? 'Success' : 'Buy Now'}</button>}
          
         </div>
        )
      }
    } 
    }

    useEffect(() =>{
      console.log(pathArray)
      console.log(tokenIdRoute);
      setTokenRouteState(tokenIdRoute)
      MetadataCall();
      getOwnerOfId();
      forIdGetSeller();
      getSoldStatus();
      if(soldStatusState) {
      getBuyerOfId();
      }
      console.log(priceState + " this is price state")
      
    },[router, tokenIdRoute, metadataLinkState, arrayState, userAddress, loadingState, buyerOfIdState, priceState, buySuccess])

     return (
        <div>
           <Navbar />
 {loading === false  ?   <div className="grid grid-cols-1 justify-items-center mt-20 mx-0">

<div>
<Link href={`../profile/${ownerOfState}`}>
    <p className="text-xl">
      
        Owner:
     {ownerOfState == userAddress ? <span className="text-blue-600"> You</span> :<span className="text-blue-500 font-semibold"> {ownerOfState} </span>}
     </p>
     </Link>
    <p className="text-4xl">
     {arrayState[0].title}
    </p>
    <Image src={arrayState[1].image} width={500} height={500} />
    <p className="text-4xl text-left max-w-[500px] ">
    {arrayState[2].description} 
    </p>
    <p className="text-md text-left">
      Price:
    </p>
    <div className="flex">
    <p className="text-4xl">
    {arrayState[3].price} FTM
    </p>
    <RenderMethod />
    </div>
    
     
</div>


</div> : <div>Loading...</div>} 
  
        </div>
     )
}