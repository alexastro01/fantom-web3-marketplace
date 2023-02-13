import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { userAddressContext } from '@/helper/userAddressContext'
import { useContext } from 'react'


const Create = () => {

    const {userAddress, setUserAdress} = useContext(userAddressContext)


    useEffect(() =>{

    }, [])

  return (
    <div>
        <Navbar />
        <div className='mx-12'>
           <div className='grid grid-cols-1 justify-items-center'>
             <p className='text-7xl mt-12'>Sell an item</p>
             <p className='text-5xl mt-8'>Step 1 : Upload an image</p>
             <div className='bg-blue-600 h-48 w-48 mt-12'>

             </div>
           </div>
        </div>
    </div>
  )
}

export default Create