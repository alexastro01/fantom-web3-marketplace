import React from 'react'

const Header = () => {
 




  return (
    <div className='grid grid-cols-1 items-center' style={{
        userSelect: 'none',
    }}>
        
        <p className='flex justify-center text-6xl mt-20'>Buy and sell goods secured by  <span className='ml-3 text-blue-600'>smart contracts</span></p>
        <p className='flex justify-center text-5xl my-12'>NFTs as <span className='ml-3 text-blue-600'>proof of purchase</span></p>
    
    </div>
  )
}

export default Header