import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-24'>
        <img src={assets.bottom_banner_image} alt="Bootom Banner" className='w-full hidden md:block'/>
        <img src={assets.bottom_banner_image_sm} alt="Bootom Banner" className='w-full md:hidden '/>
        <div className='absolute  inset-0 flex flex-col items-center md:justify-items-start justify-start md:items-end md:justify-center pt-16 md:pt-0 md:pr-24'>
  
        <h1 className='text-xl text-primary md:text-3xl font-bold mb-4'>
            Why We Are the Best
        </h1>
    <div className='items-star '>
        {features.map((feature, index) => (
        <div key={index} className='flex items-start gap-4 mt-3'>
      
            {/* ICON */}
            <img
                src={feature.icon}
                alt={feature.title}
                className='md:w-11 w-9'
            />

            {/* TEXT BLOCK */}
            <div className="flex flex-col">
                <h3 className='text-lg md:text-xl font-semibold'>
                {feature.title}
                </h3>
                <p className='text-gray-500/70 text-xs md:text-sm'>
                {feature.description}
                </p>
            </div>

            </div>
        ))}
        </div>
        </div>
    </div>
  )
}

export default BottomBanner
