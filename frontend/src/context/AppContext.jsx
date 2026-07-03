import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(true);
    const [isSeller, setIsSeller] = useState(false);
    const [showuserLogin, setShowuserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchQuery, setsearchQuery] = useState(""); // ✅ FIX
    const [cartItems, setCartItems] = useState({});

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const currency = '$';

    // ✅ FETCH PRODUCTS FROM BACKEND
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/product/list`);
            const data = await res.json();

            if (data.success) {
                setProducts(data.products);
            }
        } catch (err) {
            console.log(err);
        }
    };

    //  FETCH CART
    const fetchCart = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/user/cart/get`, {
                method: "GET",
                credentials: "include"
            });

            const data = await res.json();

            if (data.success) {
                setCartItems(data.cartItems || {});
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, []);

    // ✅ ADD TO CART
    const addToCart = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        setCartItems(cartData);

        try {
            await fetch(`${backendUrl}/api/user/cart/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ itemId })
            });
        } catch (err) {
            console.log(err);
        }

        toast.success("Added to cart");
    };

    //  REMOVE CART ITEM
    const removeCartItem = async (itemId) => {
        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            cartData[itemId] -= 1;

            if (cartData[itemId] <= 0) {
                delete cartData[itemId];
            }
        }

        setCartItems(cartData);

        try {
            await fetch(`${backendUrl}/api/user/cart/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    itemId,
                    quantity: cartData[itemId] || 0
                })
            });
        } catch (err) {
            console.log(err);
        }

        toast.success("Removed from cart");
    };

    // ✅ ADD THIS (MISSING FUNCTION FIX)
    const updateCartItem = async (itemId, quantity) => {
        let cartData = structuredClone(cartItems);

        if (quantity <= 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }

        setCartItems(cartData);

        try {
            await fetch(`${backendUrl}/api/user/cart/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ itemId, quantity })
            });
        } catch (err) {
            console.log(err);
        }
    };

    // ✅ OPTIMIZED MAP
    const productMap = useMemo(() => {
        return Object.fromEntries(products.map(p => [p._id, p]));
    }, [products]);

    // ✅ CART COUNT
    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, qty) => {
            return qty > 0 ? total + qty : total;
        }, 0);
    };

    // ✅ CART AMOUNT
    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const itemInfo = productMap[itemId];
            const quantity = cartItems[itemId];

            if (itemInfo && quantity > 0) {
                totalAmount += itemInfo.offerPrice * quantity;
            }
        }

        return Number(totalAmount.toFixed(2));
    };

    const value = {
        navigate,
        user,
        setUser,
        setIsSeller,
        isSeller,
        showuserLogin,
        searchQuery,
        setsearchQuery,
        setShowuserLogin,
        products,
        cartItems,
        setCartItems,
        currency,
        addToCart,
        updateCartItem,
        removeCartItem,
        getCartCount,
        getCartAmount,
        backendUrl
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};