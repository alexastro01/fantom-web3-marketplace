import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { userAddressContext } from '@/helper/userAddressContext'
import { useContext } from 'react'
import axios from 'axios'
import { useState } from 'react'

const Create = () => {

        const [fileImg, setFileImg] = useState(null);
        const [step, setStep] = useState(1);
        const [loadingUploadImage, setUploadLoadingImage] = useState(null);
        const [imageHash, setImageHash] = useState();
    
        const sendFileToIPFS = async (e) => {
         e.preventDefault();
            if (fileImg) {
                try {
                    setUploadLoadingImage(true)
                    const formData = new FormData();
                    formData.append("file", fileImg);
    
                    const resFile = await axios({
                        method: "post",
                        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                        data: formData,
                        headers: {
                            'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API}`,
                            'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_SECRET}`,
                            "Content-Type": "multipart/form-data"
                        },
                    });
    
                    const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                 console.log(ImgHash); 
                 setImageHash(ImgHash)
                 setUploadLoadingImage(false);
                 setStep(2);
                   
    
                } catch (error) {
                    console.log("Error sending File to IPFS: ")
                    console.log(error)
                }
            }
        }
    
    
      return (
        <>
        <Navbar />

    
    <div className='mx-12'>
        {step === 1 && 
        <div className='grid grid-cols-1 justify-items-center'>
             <p className='text-7xl mt-12'>Sell an item</p>
             <p className='text-5xl mt-8'>Step 1 : Upload an image</p>
             <div className='bg-blue-600 mt-12 '>
             <form onSubmit={sendFileToIPFS} className="grid grid-cols-1 justify-items-center w-full">
            <input className=' text-4xl' type="file" onChange={(e) =>setFileImg(e.target.files[0])} required />
            <button className='w-24 h-24' type='submit' >Upload Image</button> 
            {loadingUploadImage && <p>Loading</p>}             
           </form> 
                    
      
             </div>
           </div> }
         {
            step === 2 && 
            <div className='grid grid-cols-1 justify-items-center'>
            <p className='text-7xl mt-12'>Sell an item</p>
            <p className='text-5xl mt-8'>Step 2 : Chose title description and price</p>
       
          </div>
         }  
        
        </div>
        </>
      )
    }
export default Create