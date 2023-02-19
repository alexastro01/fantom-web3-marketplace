import React from 'react'
import Link from 'next/link'

const TokenInfoComponent = () => {
  return (
    <div className="space-y-5 grid-grid-cols-1 border-4 text-center justify-items-center">
    <div>
      <Link href={`../profile/${ownerOfState}`} >
      <p className="text-xl">
        Owner:
     {ownerOfState == userAddress ? <span className="text-blue-600"> You</span> :<span className="text-blue-500"> {ownerOfState} </span>}
     </p>
     </Link>
    </div> 
    <div>
    <p className="text-md">
     Title:
    </p>
    <p className="text-4xl">
     {arrayState[0].title}
    </p>
    </div>
    <div>
    <p className="text-md ">
      Description:
    </p>
    <p className="text-4xl px-32 text-center">
    {arrayState[2].description}
    </p>
    </div>
    <div>
    <p className="text-md">
      Price:
    </p>
    <p className="text-4xl">
    {arrayState[3].price} FTM
    </p>
    </div>
 

</div>
  )
}

export default TokenInfoComponent