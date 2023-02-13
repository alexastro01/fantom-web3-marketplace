import React from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction,  } from 'wagmi'
import useDebounce from '@/hooks/useDebounce'
import { ethers } from 'ethers'





const CreateNft = (props) => {


    const debouncedsellPrice = useDebounce(ethers.utils.parseEther(props.sellPrice), 500)
    const debouncedTokenUri = useDebounce(props.tokenuri, 500)
    const { config } = usePrepareContractWrite({
      address: '0x2853CB399033447AAf3A14c8c4bC41Be43c0856e',
      abi: [
        {"inputs":[{"internalType":"uint256","name":"sellPrice","type":"uint256"},{"internalType":"string","name":"tokenUri","type":"string"}],"name":"CreateItemToSell","outputs":[],"stateMutability":"payable","type":"function"},
      ],
      functionName: 'CreateItemToSell',
      args: [debouncedsellPrice, debouncedTokenUri],
      enabled: Boolean(debouncedsellPrice),
    })

    const { data, write } = useContractWrite(config)
 
    const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
    })


    
  return (

    <div>
  {isSuccess ? <a href={`https://ftmscan.com/tx/${data?.hash}`} target="_blank" className="rounded-lg shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform"  >Success, click for tx hash!</a> : <button disabled={!write || isLoading} type="sumbit" className="rounded-lg shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform"  onClick={write} >{isLoading ? "Minting..." : "Create & List"}</button>
}     


    </div>
  )
}

export default CreateNft