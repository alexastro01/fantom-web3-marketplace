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



export default function Profile() {

    const {userAddress, setUserAddress} = useContext(userAddressContext);
    const [userAddressState, setUserAddressState] = useState('');
    const [routeStateAddress, setRouteStateAddress] = useState();
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
        <div className='ml-12 text-xl font-light mt-8 mb-2'>Profile: {mounted ? walletAddress : null}</div>
     

        <div className='mx-12'>
             <div>
                { mounted ? userOwnRoute ? <p className='text-4xl'>Your listed items</p> : <p className='text-4xl'>Listed Items</p> : null}
                 {mounted ? <CreatedByUserCard routeWallet={walletAddress} addressOfUser={address} booleanOwnerOfRoute={userOwnRoute} mounted={mounted} /> : null }
             </div>
        </div>
    </div>
  )


  }