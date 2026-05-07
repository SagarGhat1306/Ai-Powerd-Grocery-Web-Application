import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyAddress, dummyProducts} from "../assets/assets";
import {toast} from 'react-hot-toast'

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(true);
    const [isSeller, setIsSeller] = useState(false);
    const [showuserLogin, setShowuserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setsearchQuery] = useState({});
    const [cartItems, setCartItems] = useState({});

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const checkAdminAuth = async () => {
        try {
            // Using Fetch instead of Axios
            const response = await fetch(`${backendUrl}/api/admin/is-auth`, {
                method: 'GET',
                credentials: 'include', // CRITICAL: This sends the adminToken cookie
            });

            const data = await response.json();

            if (data.success) {
                // Set the user state with the data from the backend
                setUser({ 
                    loggedIn: true, 
                    email: data.email || "Admin" 
                });
            } else {
                // If backend returns success: faalse, clear the user state
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        }
    };

    const currency = '$'

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/product/list`);
            const data = await res.json();

            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(()=>{
        fetchProducts()
    },[])

    const addToCart =  async (itemId) => {
        let  cartData = structuredClone(cartItems)

        if(cartData[itemId]) {
            cartData[itemId] += 1
        }

        else {
            cartData[itemId] = 1
        }


        setCartItems(cartData);
        toast.success("added to cart")
    }

    const updateCartItem = (itemId,quantity) => {
        let cartData = structuredClone(cartItems)

        cartData[itemId] = quantity;
        setCartItems(cartData)
        toast.success("Cart Updated")
    }

    const removeCartItem = (itemId,quantity) => {
        let cartData = structuredClone(cartItems)
        console.log(cartData)

        if(cartData[itemId]){
            cartData[itemId] -= 1
            if(cartData[itemId] == 0 ){
                delete cartData[itemId]
            }
        } 
        setCartItems(cartData)
        toast.success("Removed from Cart")
    }

const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItems) {
        // Ensure we only count positive quantities
        if (cartItems[itemId] > 0) {
            totalCount += cartItems[itemId];
        }
    }
    return totalCount;
};

const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
        // 1. Find the product details using the ID (the key in cartItems)
        let itemInfo = products.find((product) => product._id === itemId);
        
        // 2. Check if product exists and quantity is valid
        if (itemInfo && cartItems[itemId] > 0) {
            // 3. FIX: Use += to add to the total, not =+ (which just reassigns)
            totalAmount += itemInfo.offerPrice * cartItems[itemId];
        }
    }
    // 4. FIX: Use Math.floor (Capital M)
    return Math.floor(totalAmount * 100) / 100;
};


    const value = {navigate,user,setUser,setIsSeller,isSeller,showuserLogin, searchQuery, setsearchQuery, setShowuserLogin, products, cartItems, currency,addToCart,updateCartItem,removeCartItem , getCartCount , getCartAmount ,backendUrl , fetchProducts }
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () =>{
    return useContext(AppContext)
}