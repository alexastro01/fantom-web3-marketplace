import React from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction,  } from 'wagmi'
import useDebounce from '@/hooks/useDebounce'
import { ethers } from 'ethers'
import { useContext } from 'react'
import { userAddressContext } from '@/helper/userAddressContext'
import Link from 'next/link'


const CreateNft = (props) => {

  const {userAddress, setUserAddress} = useContext(userAddressContext)


    const debouncedsellPrice = useDebounce(ethers.utils.parseEther(props.sellPrice), 500)
    const debouncedTokenUri = useDebounce(props.tokenuri, 500)
    const { config } = usePrepareContractWrite({
      address: '0x162A384D5183c6e8A48d5fE0F84109E2d0079A73',
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
  {isSuccess ?
  <div className='grid grid-cols-1 space-y-5'>
  <a href={`https://ftmscan.com/tx/${data?.hash}`} target="_blank" className="rounded-lg shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform"  >Success, click for tx hash!</a>
  <Link href={`/profile/${userAddress}`} target="_blank" className="rounded-lg shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform flex justify-center"  >View in your profile</Link>
  </div>
  
  : <button disabled={!write || isLoading} type="sumbit" className="rounded-lg shadow-2xl  md:text-white bg-blue-600 px-4 py-1 dark:text-white text-xl hover:scale-105 transition-transform"  onClick={write} >{isLoading ? "Minting..." : "Create & List"}</button>
}     


    </div>
  )
}

export default CreateNft