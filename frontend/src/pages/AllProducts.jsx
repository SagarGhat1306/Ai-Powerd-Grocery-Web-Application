import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import Productcard from '../component/Productcard';

const AllProducts = () => {

  const { products, searchQuery } = useAppContext();
  const [fillteredProducts, setfillteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery?.length > 0) {
      setfillteredProducts(
        products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    } else {
      setfillteredProducts(products)
    }
  }, [products, searchQuery])

  return (
    <div className='mt-16 flex flex-col'>

      <div className='flex flex-col items-end w-max'>
        <p>All Products</p>
        <div className='w-15 h-0.5 bg-primary rounded-full'></div>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-6'>
        {fillteredProducts
          .filter(product => product.inStock)
          .map((product, index) => (
            <Productcard key={product._id || index} product={product} />
          ))}
      </div>

    </div>
  )
}

export default AllProducts