import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { userAddressContext } from "@/helper/userAddressContext";
import Navbar from "@/components/Navbar";
import { ethers } from "ethers";
import fantomABI from '../../helper/Marketplace.json'
import axios from "axios";


export default function Item() { 
  

    const {userAddress, setUserAddress} = useContext(userAddressContext);
    const [tokenRouteState, setTokenRouteState] = useState('');
    const [metadataLinkState, setMetadataLinkState] = useState();

    const router = useRouter();
    const pathArray = router.asPath.split('/');
    const tokenIdRoute = pathArray[2];



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
    },[router, tokenIdRoute, metadataLinkState])

     return (
        <div>
           <Navbar />
        </div>
     )
}