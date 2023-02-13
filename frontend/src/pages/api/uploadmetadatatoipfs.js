import Pinata from '@pinata/sdk';
import { v4 as uuidv4 } from 'uuid';

const pinata = new Pinata({ apiKey: process.env.PINATA_API_KEY, secretApiKey: process.env.PINATA_SECRET_API_KEY });

export default async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Create a unique identifier for the metadata
    const id = uuidv4();

    // Combine the metadata into a single object
    const metadata = { id, name, description, image };

    // Upload the metadata to Pinata
    const options = {
      pinataMetadata: {
        name: `metadata-${id}`,
        keyvalues: {
          metadata: JSON.stringify(metadata),
        },
      },
    };
    const { IpfsHash } = await pinata.pinJSONToIPFS(metadata, options);

    // Return the IPFS hash to the client
    res.json({ hash: IpfsHash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while uploading the metadata' });
  }
};