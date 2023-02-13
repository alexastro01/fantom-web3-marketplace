import React, { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import { userAddressContext } from '@/helper/userAddressContext'
import { useContext } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useState } from 'react'

const Create = () => {

        const [fileImg, setFileImg] = useState(null);
        const [step, setStep] = useState(1);
        const [loadingUploadImage, setUploadLoadingImage] = useState(null);
        const [imageHash, setImageHash] = useState();
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
    
    
      return (
        <>
        <Navbar />

    
    <div className='mx-12'>
        {step === 1 && 
        <div className='grid grid-cols-1 justify-items-center'>
             <p className='text-7xl mt-12'>Sell an item</p>
             <p className='text-5xl mt-8'>Step 1 : Upload an image</p>
             <div className='bg-blue-600 mt-12 '>
             <form onSubmit={sendImageToIPFS} className="grid grid-cols-1 justify-items-center w-full">
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
            <div className='grid grid-cols-2'> 
              { imageHash && <Image src={imageHash} width={500} height={500} alt="item to create"/> } 
              <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </label>
      <br />
      <br />
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <br />
      <br />
      <label>
        Price:
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </label>
      <br />
      <br />
      <button type="sumbit" onClick={sendJsonToIPFS} >SUMBIT FORM</button>
    </form>

             
            </div>
          </div>
         }  
        
        </div>
        </>
      )
    }
export default Create