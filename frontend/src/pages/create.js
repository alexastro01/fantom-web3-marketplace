import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { userAddressContext } from '@/helper/userAddressContext'
import { useContext } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'
import { FaCloudUploadAlt } from "react-icons/fa"

const Create = () => {

        const [fileImg, setFileImg] = useState(null);
        const [step, setStep] = useState(1);
        const [loadingUploadImage, setUploadLoadingImage] = useState(null);
        const [imageHash, setImageHash] = useState();
        const [loadingJson, setLoadingJson] = useState(null);
        const [formData, setFormData] = useState({
          title: "",
          description: "",
          image: "",
          price: "",
        });
    
        const sendImageToIPFS = async (e) => {
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
    
                    const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
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

        const sendJsonToIPFS = async () => {
          setLoadingJson(true);
         let data = JSON.stringify({
            "pinataOptions": {
              "cidVersion": 1
            },
            "pinataMetadata": {
              "name": "testing",
              "keyvalues": {
                "customKey": "customValue",
                "customKey2": "customValue2"
              }
            },
            "pinataContent": [
           { "title": `${formData.title}`},
           { "image": imageHash},
           { "description": `${formData.description}`},
           { "price": `${formData.price}`}
          ]
          })

          var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: { 
              'Content-Type': 'application/json', 
              'pinata_api_key': `${process.env.NEXT_PUBLIC_PINATA_API}`,
              'pinata_secret_api_key': `${process.env.NEXT_PUBLIC_PINATA_SECRET}`,
            },
            data : data
          }


          const res = await axios(config);
          console.log(res.data);
         
          setStep(3);
        }
        

        const handleChange = (event) => {
         
          setFormData({
            ...formData,
            [event.target.name]: event.target.value,
          });
        
        };


        const handleSubmit = (event) => {
          event.preventDefault();
          console.log(formData);
        };


        async function createNFT() {

        }
    
    
      return (
        <>
        <Navbar />

    
    <div className='mx-12' style={{
        userSelect: 'none',
    }}>
        {step === 1 && 
        <div className='grid grid-cols-1 justify-items-center'>
             <p className='text-7xl mt-12'>Sell an item</p>
             <p className='text-5xl mt-8'>Step 1 : Upload an image</p>
             <div className=' mt-12 '>
             <form onSubmit={sendImageToIPFS} className="grid grid-cols-1 justify-items-center w-full">
              <label className='w-80 h-40  rounded-2xl shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform' >
                <div className=''>
                {fileImg ?  <p className='flex justify-center mt-8 text-4xl'>{fileImg.name}</p> : 
                <div className='grid items-center justify-items-center mt-8 cursor-pointer '>
                <p className=''>Upload an image</p> 
                <FaCloudUploadAlt size={80} className="flex justify-center" /> 
                </div>
                }
                </div>
            <input className=' text-4xl ' type="file" onChange={(e) =>setFileImg(e.target.files[0])} required />
            </label>
           {fileImg && <button className=' mt-8 rounded-2xl shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform' >Confirm</button> }
            {loadingUploadImage && <p>Loading</p>}             
           </form> 
                    
      
             </div>
           </div> }
         {
            step === 2 && 
            <div className='grid grid-cols-1 justify-items-center'>
            <p className='text-7xl mt-12'>Sell an item</p>
            <p className='text-5xl mt-8'>Step 2 : Chose title description and price</p>
            <div className='grid grid-cols-2 justify-items-center items-center mt-8'> 
              { imageHash && <Image src={imageHash} width={500} height={500} alt="item to create" className='rounded-lg'/> } 
              <form onSubmit={handleSubmit} className="flex-col"  >
   
        <input
        type="text"
        name="title"
         className='p-2  border-blue-600 border-2 rounded-xl w-72'
         placeholder='Title'
          value={formData.title}
          onChange={handleChange}
        />
      
      <br />
      <br />
     
        <input
          type="text"
          name="description"
          className='p-2  border-blue-600 border-2 rounded-xl w-72'
          placeholder='Description'
          value={formData.description}
          onChange={handleChange}
        />
    
      <br />
      <br />

        <input
          type="text"
          name="price"
          className='p-2  border-blue-600 border-2 rounded-xl w-72  '
          placeholder='Price in $FTM'
          value={formData.price}
          onChange={handleChange}
        />
    
      <br />
      <br />
      <div className='grid justify-items-center'>
      <button type="sumbit" className="rounded-lg shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform "  onClick={sendJsonToIPFS} >SUBMIT FORM</button>
      {loadingJson && <p className='flex justify-center'>Loading</p>}

      </div>
    </form>

             
            </div>
          </div>
         } 
         {step === 3 && 
        <div className='grid grid-cols-1 justify-items-center'>
             <p className='text-7xl mt-12'>Sell an item</p>
             <p className='text-5xl mt-8'>Step 3 : Confirm 🎉</p>
             <div className=' mt-12 '>
             <div className='p-2 space-y-2 m-5 bg-[#F5F5F5] rounded-2xl drop-shadow-md grid grid-cols-1 justify-items-center '>
             {imageHash && <Image src={imageHash} alt="Final card" className='rounded-2xl hover:scale-105  hover:rounded-2xl transition-transform cursor-pointer' width={350} height={350} /> }
              <p className="flex justify-center font-semibold text-2xl">{formData.title}</p>
              <p className="flex justify-center font-semibold">{formData.description}</p>
              <p className="flex justify-center font-semibold text-xl">{formData.price} FTM</p>
              <div className='flex justify-center'>
              <button type="sumbit" className="rounded-lg shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform"  onClick={createNFT} >CREATE & LIST</button>
              </div>
              </div>
                    
      
             </div>
           </div> } 
        
        </div>
        </>
      )
    }
export default Create