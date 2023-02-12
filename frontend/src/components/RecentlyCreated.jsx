import React from 'react'
import { useEffect } from 'react'
import { useEvmNativeBalance } from '@moralisweb3/next';

const RecentlyCreated = () => {

  const address = '0x308a6b3375E708b2d254974FFBd36e3a4193b55c';
    const { data: nativeBalance } = useEvmNativeBalance({ address });

  return (
    <div>
        <div className='grid grid-cols-4 justify-items-center '>
             <div className=''>
test
             </div>
             <div>
             test
             </div>
             <div>
             test
             </div>
             <div>
             test
             </div>
        </div>
        <div>
        <div>
            <h3>Wallet: {address}</h3>
            <h3>Native Balance: {nativeBalance?.balance.ether} ETH</h3>
        </div>
        </div>
    </div>
  )
}

export default RecentlyCreated