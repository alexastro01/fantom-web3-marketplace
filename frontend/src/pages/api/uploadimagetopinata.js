import PinataClient from "@pinata/sdk";
import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { Readable } from "stream";

const pinata = new PinataClient(`${process.env.NEXT_PUBLIC_PINATA_API}`, `${process.env.NEXT_PUBLIC_PINATA_SECRET}`);

export default async function handler(req, res) {
    try {
      // Get the image data from the request
      const imageData = new Readable();
      const options = {
         pinataMetadata: {
            name: 'aweseomImage',
        }
    }


      imageData.push(req.body);
      imageData.push(null);
  
      // Upload the image to IPFS
      const result = await pinata.pinFileToIPFS(imageData, options);
 
      // Return the IPFS hash of the image
      res.status(200).json({ hash: result.IpfsHash });
    } catch (error) {
      // Return an error if something went wrong
      res.status(500).json({ error: error.message });
    }
  }

