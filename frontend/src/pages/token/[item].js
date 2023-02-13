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

export default function Item() { 
  

    const {userAddress, setUserAddress} = useContext(userAddressContext);
    const [tokenRouteState, setTokenRouteState] = useState('');
    const [metadataLinkState, setMetadataLinkState] = useState();
    const [arrayState, setArrayState] = useState([]);
    const [loading, setIsLoading] = useState(true);

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
    },[router, tokenIdRoute, metadataLinkState, arrayState])

     return (
        <div>
           <Navbar />
 {loading === false  ?   <div className="grid grid-cols-2 justify-items-center mt-20">

<div>
    <Image src={arrayState[1].image} width={500} height={500} /> 
</div>
<div>
    <p className="text-5xl">
     Title: {arrayState[0].title}
    </p>
    <p className="text-5xl">
      Description:  {arrayState[2].description}
    </p>
    <p className="text-5xl">
      Price:  {arrayState[3].price}
    </p>
</div>

</div> : <div>Loading...</div>} 
  
        </div>
     )
}