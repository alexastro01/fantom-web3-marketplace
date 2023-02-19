import Image from 'next/image'
import React from 'react'
import { ethers } from 'ethers'
const LandingPageNftEvent = (props) => {
  return (
    <div className='grid grid-cols-1'>
        <Image src={props.image} width={100} height={100} />
        <p>{props.title}</p>
        <p>{props.description}</p>
        <p>{props.amount}</p>
        <p>{props.id}</p>
        <p>{props.address}</p>
    </div>
  )
}

export default LandingPageNftEvent