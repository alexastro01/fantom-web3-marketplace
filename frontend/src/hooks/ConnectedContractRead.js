import { useEffect, useState } from "react";
import { ethers } from "ethers";
import fantomABI from '../helper/Marketplace.json'

export function ConnectedContractRead() {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";

    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom/');
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      provider
    )

  
    return connectedContract;
}