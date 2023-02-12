import React from 'react'
import { useContext } from 'react'
import { userAddressContext } from '@/helper/userAddressContext'
import Navbar from '@/components/Navbar'

const test = () => {

    const {userAddress, setUserAddress} = useContext(userAddressContext);

  return (
    <div>
        <Navbar />
        {userAddress ? <p>{userAddress}</p> : <p>none</p>}
    </div>
  )
}

export default test