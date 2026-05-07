import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {

  const sidebarLinks = [
    { name: "Add products", path: "/add-product", icon: assets.add_icon },
    { name: "Product list", path: "/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/orders", icon: assets.order_icon }, // Fixed duplicate name
  ];

  return (
    <div className="md:w-64 w-16 border-r min-h-[calc(100vh-70px)] border-gray-300 pt-4 flex flex-col transition-all duration-300 bg-white">
      {sidebarLinks.map((item, index) => (
        <NavLink 
          to={item.path} 
          key={index}
          className={({ isActive }) => 
            `flex items-center py-3 px-4 gap-3 transition-all
            ${isActive 
                ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary" 
                : "hover:bg-gray-100 text-gray-700 border-transparent border-r-4 md:border-r-[6px]"
            }`
          }
        >
          {/* Changed this to an img tag to properly show your assets */}
          <img className="w-5 h-5 object-contain" src={item.icon} alt={item.name} />
          
          <p className="md:block hidden font-medium text-sm">{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar