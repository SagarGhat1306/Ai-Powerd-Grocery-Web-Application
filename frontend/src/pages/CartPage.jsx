import { assets, dummyAddress } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
const CartPage = () => {
    const [showAddress, setShowAddress] = useState(false);
    const { 
        navigate, 
        products, 
        cartItems, 
        removeCartItem, 
        updateCartItem, 
        getCartCount, 
        getCartAmount,
        setCartItems,
        backendUrl ,
    } = useAppContext();

    const [cartArray, setcartArray] = useState([]);
    const [addresses, setaddresses] = useState([]);
    const [selectedAddress, setselectedAddress] = useState(null);
    const [paymentOption, setpaymentOption] = useState("COD");

    // Sync Cart Items with Product Data
    const getCart = () => {
        let tempArray = [];
        for (const key in cartItems) {
            if (cartItems[key] > 0) {
                const product = products.find((item) => item._id === key);
                if (product) {
                    // Create a shallow copy to add quantity without mutating original product
                    tempArray.push({ ...product, quantity: cartItems[key] });
                }
            }
        }
        setcartArray(tempArray);
    };

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart();
        }
    }, [products, cartItems]);

    useEffect(() => {
    const fetchAddresses = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/address/get`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            console.log(data)

            if (data.success) {
                setaddresses(data.addresses);

                // auto select first address
                if (data.addresses.length > 0) {
                    setselectedAddress(data.addresses[0]);
                }


            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch addresses");
        }
    };

    fetchAddresses();
}, []);

const placeOrder = async () => {
    try {

        // ❌ No address selected
        if (!selectedAddress) {
            toast.error("Please select address");
            return;
        }

        // ❌ Empty cart
        if (cartArray.length === 0) {
            toast.error("Cart is empty");
            return;
        }

        // ✅ Prepare order data
        const orderData = {
                items: cartArray.map(item => ({
                product: item._id,
                quantity: item.quantity
            })),
            address: selectedAddress._id
        };

        // ✅ COD Order
        if (paymentOption === "COD") {

            const response = await fetch(`${backendUrl}/api/order/place-cod`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                toast.error("Server error");
                return;
            }

            const data = await response.json();

            if (data.success) {
                toast.success("Order placed successfully");

                setCartItems({})
                // ✅ Redirect
                navigate("/my-orders");
        

            } else {
                toast.error(data.message);
            }

        } else {
            toast.info("Online payment not implemented yet");
        }

    } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
    }
};

    return products.length > 0 ? (
        <div className="flex flex-col md:flex-row mt-16 gap-10 px-4 md:px-0">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">({getCartCount()} items)</span>
                </h1>

                <div className="grid grid-cols-[3fr_1fr_1fr] text-gray-500 text-base font-medium pb-3 border-b border-gray-200">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[3fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium py-6 border-b border-gray-100">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div 
                                onClick={() => { navigate(`/product/${product._id}`); window.scrollTo(0, 0) }} 
                                className="cursor-pointer w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                            >
                                <img 
                                    className="max-w-full h-full object-cover" 
                                    src={product.image[0]} 
                                    alt={product.name} 
                                />
                            </div>
                            <div>
                                <p className="text-gray-800 font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500 text-xs md:text-sm mt-1">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center gap-2 mt-1'>
                                        <p>Qty:</p>
                                        <select 
                                            value={product.quantity} 
                                            onChange={(e) => updateCartItem(product._id, Number(e.target.value))}
                                            className='outline-none border border-gray-200 rounded px-1'
                                        >
                                            {[...Array(10).keys()].map((n) => (
                                                <option key={n + 1} value={n + 1}>{n + 1}</option>
                                            ))}a
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center text-gray-800">${(product.offerPrice * product.quantity).toFixed(2)}</p>
                        <button onClick={() => removeCartItem(product._id)} className="cursor-pointer mx-auto p-2 hover:bg-red-50 rounded-full transition">
                            <img className="w-5 h-5" src={assets.remove_icon} alt="remove" />
                        </button>
                    </div>
                ))}

                <button onClick={() => { navigate("/products"); window.scrollTo(0, 0) }} className="group cursor-pointer flex items-center mt-8 gap-2 text-gray-500 font-medium hover:text-indigo-600 transition">
                    <img src={assets.arrow_right_icon_colored} alt="arrow" className="rotate-180 group-hover:-translate-x-1 transition" />
                    Continue Shopping
                </button>
            </div>

            {/* Summary Section */}
            <div className="md:w-[360px] w-full bg-gray-100/40 p-6 border border-gray-300/70 rounded-lg h-fit">
                <h2 className="text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {selectedAddress 
                                ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` 
                                : "No address found"}
                        </p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary text-sm font-medium hover:underline cursor-pointer ml-2">
                            Change
                        </button>
                        
                        {showAddress && (
                            <div className="absolute top-full right-0 mt-2 z-10 bg-white border border-gray-300 shadow-xl rounded overflow-hidden w-full min-w-[200px]">
                                {addresses.map((address, index) => (
                                    <p 
                                        key={index}
                                        onClick={() => { setselectedAddress(address); setShowAddress(false) }} 
                                        className="text-gray-600 p-3 text-xs hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-0"
                                    >
                                        {address.street}, {address.city}, {address.state}
                                    </p>
                                ))}
                                <p onClick={() => navigate('/address')} className="text-indigo-500 text-center font-medium cursor-pointer p-3 text-xs hover:bg-indigo-50">
                                    + Add New Address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-xs font-bold uppercase text-gray-400 tracking-wider mt-8">Payment Method</p>
                    <select 
                        onChange={(e) => setpaymentOption(e.target.value)} 
                        className="w-full border border-gray-300 bg-white px-3 py-2.5 mt-2 rounded text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-600 mt-4 space-y-3 text-sm">
                    <p className="flex justify-between">
                        <span>Subtotal</span><span>${getCartAmount().toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>${(getCartAmount() * 0.02).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between text-lg font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                        <span>Total:</span><span>${(getCartAmount() * 1.02).toFixed(2)}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-4 mt-8 rounded-md cursor-pointer bg-primary text-white font-bold hover:bg-[#038d5a] transition shadow-md shadow-indigo-200">
                    {paymentOption === "COD" ? "PLACE ORDER" : "PROCEED TO CHECKOUT"}
                </button>
            </div>
        </div>
    ) : (
        <div className="h-[60vh] flex flex-col items-center justify-center">
            <p className="text-gray-500 mb-4">Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="bg-indigo-600 text-white px-6 py-2 rounded">Shop Now</button>
        </div>
    );
}

export default CartPage;