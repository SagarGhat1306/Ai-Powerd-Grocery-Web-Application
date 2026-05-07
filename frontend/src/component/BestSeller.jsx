import React from 'react'
import Productcard from './Productcard'
import { dummyProducts  } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {

return(
    <div className=' mt-16'>
    <p className='text-2xl md:text3xl font-medium'>Best Sellers</p>
   <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols- lg:g5rid-cols-5 xl:grid-cols-5 mt-6'>
      {dummyProducts
        ?.filter((item) => item?.inStock)
        ?.slice(0, 5)
        ?.map((item) => (
          <Productcard key={item._id} product={item} />
        ))}
    </div>
    </div>
)
}

export default BestSeller
