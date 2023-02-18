import React from 'react'
import Image from 'next/image'

const NftCard = (props) => {
  return (
    <div className=' mx-6 my-6 '>
    <div className='p-0 space-y-5  bg-[#F5F5F5]  rounded-t-2xl  drop-shadow-md grid grid-cols-1 justify-items-center min-h-[600px]  '>
     <Image src={props.image} width={400} height={400} className="rounded-lg pt-5 hover:scale-105 transition-transform "/>
     <p className="flex justify-center font-semibold text-2xl">{props.title}</p>
     <p className="flex justify-center font-semibold">{props.description}</p>
     <p className="flex justify-center font-semibold text-xl">{props.price} FTM</p>
    
     </div>
     <div className='flex justify-center'>
     <button className='bg-blue-600 text-white font-bold w-full rounded-lg mt-2 h-12 hover:scale-105 transition-transform '>{props.ownerOfRoute ? 'You own this item' : 'Buy now'}</button>
     </div>

    </div>
  )
}

export default NftCard