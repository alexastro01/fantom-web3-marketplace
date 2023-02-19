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
      setSellerState(seller);
      
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

    useEffect(() =>{
      console.log(pathArray)
      console.log(tokenIdRoute);
      setTokenRouteState(tokenIdRoute)
      MetadataCall();
      getOwnerOfId();
      forIdGetSeller();
    },[router, tokenIdRoute, metadataLinkState, arrayState])

     return (
        <div>
           <Navbar />
 {loading === false  ?   <div className="grid grid-cols-2 justify-items-center mt-20 mx-20">

<div>
    <Image src={arrayState[1].image} width={500} height={500} /> 
</div>
<div className="space-y-5 grid-grid-cols-1 border-4 text-center justify-items-center">
    <div>
      <Link href={`../profile/${ownerOfState}`} >
      <p className="text-xl">
        Owner:
     {ownerOfState == userAddress ? <span className="text-blue-600"> You</span> :<span className="text-blue-500"> {ownerOfState} </span>}
     </p>
     </Link>
    </div> 
    <div>
    <p className="text-md text-left">
     Title:
    </p>
    <p className="text-4xl">
     {arrayState[0].title}
    </p>
    </div>
    <div>
    <p className="text-md text-left">
      Description:
    </p>
    <p className="text-4xl px-32 text-center">
    {arrayState[2].description}
    </p>
    </div>
    <div>
    <p className="text-md text-left">
      Price:
    </p>
    <p className="text-4xl">
    {arrayState[3].price} FTM
    </p>
    </div>
 

</div>

</div> : <div>Loading...</div>} 
  
        </div>
     )
}