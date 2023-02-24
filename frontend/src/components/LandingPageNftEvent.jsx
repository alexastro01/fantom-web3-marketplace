import Image from 'next/image'
import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import Link from 'next/link'

const LandingPageNftEvent = (props) => {

useEffect(() => {
console.log(ethers.utils.parseEther(props.amount) )
},[])

  return (
<div className='grid grid-cols-1 text-center justify-items-center border-2 rounded-lg border-gray-200 lg:mx-12 lg:space-y-2 lg:my-2 lg:py-4'>
<p className='text-xl font-bold'>{props.title}</p>
  <div className="flex items-center justify-center w-[300px] h-[300px]">
    <Link href={`token/${props.id}`}>
    <Image src={props.image} width={300} height={300} className="object-contain rounded-2xl hover:scale-105 transition-transform p-12 lg:p-0" />
    </Link>
  </div>
  
  <p>{props.description && props.description.slice(0, 40)}...</p>
  
 
   
    {props.isSold === true ?  <p className='text-blue-500 font-semibold'>{ethers.utils.formatEther(props.amount)} FTM</p> : 
    <p className='text-blue-500 font-semibold'>{props.amount} FTM</p>
    } 


  <p className='font-bold'>Token id - {props.id}</p>
  <Link href={`profile/${props.address}`}>
  <button className='bg-gray-800 text-white font-bold  w-48 rounded-lg  h-10 hover:scale-105 transition-transform ' onClick={null}>{props.isSold ? 'Buyer ' : 'Seller ' }{props.address.slice(0,7)}</button>
  </Link>
</div>
  )
}

export default LandingPageNftEvent