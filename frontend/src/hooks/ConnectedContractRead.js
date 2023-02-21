import { useEffect, useState } from "react";
import { ethers } from "ethers";
import fantomABI from '../helper/Marketplace.json'

export function ConnectedContractRead() {
    const CONTRACT_ADDRESS = "0x84EDAf725e649D0034348f345eBAA05624566861";

    const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom/');
    const signer = provider.getSigner();
    const connectedContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      fantomABI,
      provider
    )

  
    return connectedContract;
}