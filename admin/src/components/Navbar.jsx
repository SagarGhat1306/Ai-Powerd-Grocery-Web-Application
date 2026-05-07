import React, { useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {assets} from '../assets/assets'
import { useAppContext } from "../context/AppContext";
import { toast } from 'react-hot-toast';
const Navbar = () => {
 const [open, setOpen] = React.useState(false)

 const {user,setUser,setShowuserLogin,navigate,searchQuery, setsearchQuery,getCartCount,backendUrl} = useAppContext();

 useEffect(()=>{

    if(searchQuery.length>0){
        navigate('/products')
    }
 },[searchQuery])

    const logout = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/admin/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                toast.error("Server error");
                return;
            }

            const data = await response.json();

            if (data.success) {
                setUser(null);
                toast.success("Logged out successfully");
                navigate('/login', { replace: true });
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Logout error");
        }
    };

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to = '/' onClick={()=> setOpen(false)}>
              <img className='h-9' src = {assets.logo} alt =""/>
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
            
                {
                !user ? (
                    <button
                    onClick={() => setShowuserLogin(true)}
                    className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary/50 transition text-white rounded-full"
                    >
                    Login
                    </button>
                ) : (
                    <div className="relative group">
                        <img
                            src={assets.profile_icon}
                            className="w-10 cursor-pointer"
                            alt="profile"
                        />
                        <ul className="hidden group-hover:block absolute top-10 right-0 mt-2 bg-white shadow-lg border border-gray-5200 py-2.5 w-30 text-sm rounded-md z-40 ">
                            <li onClick={()=> logout()} className="p-1.5 pl-3  hover:bg-primary/10 cursor-pointer">
                                Logout
                            </li>
                        </ul>
                    </div>
                )
                }

            </div>
        
        </nav>
    )
}

export default Navbar

