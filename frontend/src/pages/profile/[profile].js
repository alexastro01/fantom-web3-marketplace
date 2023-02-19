import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar';
import { useContext } from 'react';
import { userAddressContext } from '@/helper/userAddressContext';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useIsMounted } from '@/hooks/useIsMounted';
import CreatedByUserCard from '@/components/profile/CreatedByUserCard';
import fantomABI from '../../helper/Marketplace.json'
import withRouter from 'next/router';
import BoughtByUserCard from '@/components/profile/BoughtByUserCard';



export default function Profile() {

    const {userAddress, setUserAddress} = useContext(userAddressContext);
    const [userAddressState, setUserAddressState] = useState('');
    const [routeStateAddress, setRouteStateAddress] = useState();
    const [balanceState, setBalanceState] = useState();
    // 1 = listed items; 2 = bought items
    const [stateOfPage, setStateOfPage] = useState(1)
    const mounted = useIsMounted(); 
    const { address } = useAccount();

    const [userOwnRoute, setUserOwnRoute] = useState();
    const [invalidAddress, setInvalidAddress] = useState();
    const router = useRouter();
    const pathArray = router.asPath.split('/');
    const walletAddress = pathArray[2];

    console.log(pathArray);
    console.log(walletAddress);


    useEffect(() => {
      
        setUserAddressState(address);
        if (address.toLowerCase()  === walletAddress.toLowerCase()) {
            setUserOwnRoute(true);
          } else if (address.toLowerCase() !== walletAddress.toLowerCase()) {
            setUserOwnRoute(false);
          }
          if (ethers.utils.isAddress(walletAddress) === false) {
            setInvalidAddress(true);
          } else {
            setInvalidAddress(false);
          }
          setRouteStateAddress(walletAddress)  
          console.log(walletAddress + " this is in parent useEffect")

          getBalanceOfUser();
      
    },[userAddress, walletAddress, address, mounted, stateOfPage]);


    async function withdrawFunds () {
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      )

      const withdrawl = await connectedContract.withDrawSeller();
      withdrawl.wait();
      console.log('withdraw finished');

    }


    async function getBalanceOfUser () {
      const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
      const { ethereum } = window;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        fantomABI,
        signer
      )
  
      
       const balanceOfUser = await connectedContract.balanceUser(walletAddress);
       console.log(balanceOfUser + " " +"this is balance")
       const balancetostring = balanceOfUser.toString()
       const balanceInNumber = ethers.utils.formatEther(balancetostring);
       console.log(balanceInNumber + " " +"this is balance");
       setBalanceState(balanceInNumber)
       
    }
 






  return (
    <div className=''>
        <Navbar/>
        
     

        <div className='mx-12 mt-8'>
             <div>
              <div className='flex   '>
              <button className=' text-white font-bold w-48 mr-5  rounded-lg mt-2 h-12 hover:scale-105 transition-transform ' style={{
                backgroundColor: stateOfPage === 2 ? `#2590EB` : '#1F2937'
              }} onClick={() => setStateOfPage(1)}>View Created Items</button>
              <button className=' text-white font-bold w-48 ml-5 rounded-lg mt-2 h-12 hover:scale-105 transition-transform '  style={{
                backgroundColor: stateOfPage === 1 ? `#2590EB` : '#1F2937'
              }} onClick={() => setStateOfPage(2)}>View Bought Items</button>
              <div className='ml-auto flex'>
              <button className=' text-white font-bold  rounded-lg mt-2 h-12 hover:scale-105 transition-transform mr-8 bg-gray-800 w-72 '>Profile: {mounted ? walletAddress.slice(0, 18) : null}</button>
              {userOwnRoute &&
              <button className='text-white font-bold  rounded-lg mt-2 h-12 hover:scale-105 transition-transform mr-8 bg-gray-800 w-44'>Balance : {balanceState} FTM</button>
              } 
               {userOwnRoute &&
              <button className=' text-white font-bold  rounded-lg mt-2 h-12 hover:scale-105 transition-transform mr-8 bg-[#2590EB] w-44 ' onClick={withdrawFunds}>Withdraw </button>
               }
              </div>
              </div>
                { mounted ?  stateOfPage === 1 && <p className='text-4xl my-5'>{ userOwnRoute ? `Your Created Items` : 'Created Items'}</p> : null}
                { mounted ?  stateOfPage === 2 && <p className='text-4xl my-5'>{ userOwnRoute ? `Your Bought Items` : 'Bought Items'}</p> : null}
                 {mounted ? stateOfPage === 1 && <CreatedByUserCard routeWallet={walletAddress} addressOfUser={address} booleanOwnerOfRoute={userOwnRoute} mounted={mounted} stateOfPage={stateOfPage}/> : null }
                 {mounted ? stateOfPage === 2 && <BoughtByUserCard routeWallet={walletAddress} addressOfUser={address} booleanOwnerOfRoute={userOwnRoute} mounted={mounted} stateOfPage={stateOfPage}/>  : null }
             </div>
        </div>
    </div>
  )


  }