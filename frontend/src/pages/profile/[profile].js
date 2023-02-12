import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar';
import { useContext } from 'react';
import { userAddressContext } from '@/helper/userAddressContext';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function Profile() {

    const {userAddress, setUserAddress} = useContext(userAddressContext);
    const [userAddressState, setUserAddressState] = useState('');

    const { address } = useAccount();

    const [userOwnRoute, setUserOwnRoute] = useState();
    const [invalidAddress, setInvalidAddress] = useState();
    const router = useRouter();
    const pathArray = router.asPath.split('/');
    const walletAddress = pathArray[2];

    console.log(pathArray);
    console.log(address);


    useEffect(() => {
        setUserAddressState(address);
        if (address === walletAddress) {
            setUserOwnRoute(true);
          } else if (address !== walletAddress) {
            setUserOwnRoute(false);
          }
          if (ethers.utils.isAddress(walletAddress) === false) {
            setInvalidAddress(true);
          } else {
            setInvalidAddress(false);
          }
      
    },[userAddress, router.asPath, address])


  return (
    <div>
        <Navbar/>
        <div>{address}</div>
        <div>{userOwnRoute ? <div>ADDRESS OWNS THIS ROUTE</div> :<div>ADDRESS DOESN'T OWN THIS ROUTE</div> }</div>
        <div>{invalidAddress ? <div className='text-red-400'>ADDRESS NOT VALID</div> : <div></div>}</div>
    </div>
  )


  }