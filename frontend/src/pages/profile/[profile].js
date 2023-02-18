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
import withRouter from 'next/router';
import BoughtByUserCard from '@/components/profile/BoughtByUserCard';



export default function Profile() {

    const {userAddress, setUserAddress} = useContext(userAddressContext);
    const [userAddressState, setUserAddressState] = useState('');
    const [routeStateAddress, setRouteStateAddress] = useState();
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
        if (address  === walletAddress) {
            setUserOwnRoute(true);
          } else if (address !== walletAddress) {
            setUserOwnRoute(false);
          }
          if (ethers.utils.isAddress(walletAddress) === false) {
            setInvalidAddress(true);
          } else {
            setInvalidAddress(false);
          }
          setRouteStateAddress(walletAddress)  
          console.log(walletAddress + " this is in parent useEffect")
      
    },[userAddress, walletAddress, address, mounted]);


 






  return (
    <div className=''>
        <Navbar/>
        <div className='ml-12  font-light mt-8 mb-2 text-sm'>Profile: {mounted ? walletAddress : null}</div>
     

        <div className='mx-12'>
             <div>
              <div className='flex space-x-5 '>
              <button className=' text-white font-bold w-48  rounded-lg mt-2 h-12 hover:scale-105 transition-transform ' style={{
                backgroundColor: stateOfPage === 1 ? `#2590EB` : '#22425e'
              }} onClick={() => setStateOfPage(1)}>View Created Items</button>
              <button className=' text-white font-bold w-48 rounded-lg mt-2 h-12 hover:scale-105 transition-transform '  style={{
                backgroundColor: stateOfPage === 2 ? `#2590EB` : '#22425e'
              }} onClick={() => setStateOfPage(2)}>View Bought Items</button>
              </div>
                { mounted ?  stateOfPage === 1 && <p className='text-4xl my-5'>{ userOwnRoute ? `Your Created Items` : 'Created Items'}</p> : null}
                { mounted ?  stateOfPage === 2 && <p className='text-4xl my-5'>{ userOwnRoute ? `Your Bought Items` : 'Bought Items'}</p> : null}
                 {mounted ? stateOfPage === 1 && <CreatedByUserCard routeWallet={walletAddress} addressOfUser={address} booleanOwnerOfRoute={userOwnRoute} mounted={mounted} /> : null }
                 {mounted ? stateOfPage === 2 && <BoughtByUserCard routeWallet={walletAddress} addressOfUser={address} booleanOwnerOfRoute={userOwnRoute} mounted={mounted} /> : null }
             </div>
        </div>
    </div>
  )


  }