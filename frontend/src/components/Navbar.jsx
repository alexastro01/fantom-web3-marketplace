import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from "react";
import { userAddressContext } from '@/helper/userAddressContext'
import Link from 'next/link'
const Navbar = () => {


  const { userAddress, setUserAddress } = useContext(userAddressContext);

  const {address} = useAccount();

  useEffect(() => {
    
    console.log(address)
    setUserAddress(address);
  },[userAddress])

   


  return (
    
<nav class="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
  <div class="container flex flex-wrap items-center justify-between mx-auto">
    <Link href="/" class="flex items-center">
        <h1 className='font-bold text-blue-600 text-3xl'>Fantom Marketplace</h1>
        
    </Link>
    <button data-collapse-toggle="navbar-default" type="button" class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
      <span class="sr-only">Open main menu</span>
      <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
    <div class="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 items-center ">
      <li>
         <ConnectButton />
        </li>
        <li>
          {address &&  <Link href={`/profile/${address}`} class="block   rounded-lg shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform " aria-current="page">My Profile</Link> }
        </li>

      
         <li>
          
         </li>
      </ul>
    </div>
  </div>
</nav>

  )
}

export default Navbar