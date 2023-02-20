import { useEffect, useState } from "react";
import { ethers } from "ethers";
import fantomABI from '../helper/Marketplace.json'

export function ConnectedContractWrite() {
    const CONTRACT_ADDRESS = "0x162A384D5183c6e8A48d5fE0F84109E2d0079A73";
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      signer
    )

  
    return connectedContract;
}