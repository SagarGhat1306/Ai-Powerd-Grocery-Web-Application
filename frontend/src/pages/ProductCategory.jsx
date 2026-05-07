import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams } from 'react-router-dom'
import Productcard from '../component/Productcard'

const ProductCategory = () => {

  const { products } = useAppContext()
  const { category } = useParams()

  // ✅ Filter products
  const filteredProducts = products.filter(
    (product) =>
      product.category?.toLowerCase() === category?.toLowerCase()
  )

  return (
    <div className='mt-16'>

      {/* TITLE */}
      <div>
        <p className='text-2xl font-medium'>
          {category?.toUpperCase()}
        </p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {/* PRODUCTS */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mt-6'>
        {filteredProducts.map((product, index) => (
          <Productcard key={product._id || index} product={product} />
        ))}
      </div>

    </div>
  )
}

export default ProductCategory