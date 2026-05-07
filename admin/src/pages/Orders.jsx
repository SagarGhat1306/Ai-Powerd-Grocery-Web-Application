import React, { useEffect, useState } from 'react';
import { assets, dummyOrders } from '../assets/assets'; // Adjust path if necessary
import { useAppContext } from '../context/AppContext';

const Orders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const { currency, backendUrl } = useAppContext();

    // Fetch orders on component mount

     useEffect(() => {
            const fetchOrders = async () => {
                try {
                    const response = await fetch(`${backendUrl}/api/order/all-orders`, {
                        method: "GET",
                        credentials: "include"
                    });
    
                    if (!response.ok) {
                        console.log("API error");
                        return;
                    }
    
                    const data = await response.json();
    
                    if (data.success) {
                        setMyOrders(data.orders);
                    } else {
                        console.log(data.message);
                    }
    
                } catch (error) {
                    console.log(error);
                }
            };
    
            fetchOrders();
        }, []);

        const updateStatus = async (orderId, currentStatus) => {
            try {
                let nextStatus = "Order Placed";

                if (currentStatus === "Order Placed") nextStatus = "Shipped";
                else if (currentStatus === "Shipped") nextStatus = "Delivered";

                const response = await fetch(`${backendUrl}/api/order/update-status`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ orderId, status: nextStatus })
                });

                const data = await response.json();

                if (data.success) {
                    // update UI instantly
                    setMyOrders(prev =>
                        prev.map(order =>
                            order._id === orderId
                                ? { ...order, status: nextStatus }
                                : order
                        )
                    );
                } else {
                    console.log(data.message);
                }

            } catch (error) {
                console.log(error);
            }
        };

        const togglePayment = async (orderId) => {
            try {
                const response = await fetch(`${backendUrl}/api/order/toggle-payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ orderId })
                });

                const data = await response.json();

                if (data.success) {
                    setMyOrders(prev =>
                        prev.map(order =>
                            order._id === orderId
                                ? { ...order, isPaid: data.isPaid }
                                : order
                        )
                    );
                } else {
                    console.log(data.message);
                }

            } catch (error) {
                console.log(error);
            }
        };
        
    return (
        <div className="md:p-10 p-4 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">My Orders</h2>
            
            {myOrders.length === 0 ? (
                <p className="text-gray-500">You have no orders yet.</p>
            ) : (
                myOrders.map((order, index) => (
                    <div key={index} className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800 bg-white shadow-sm">
                        
                        {/* Column 1: Items & Icon */}
                        <div className="flex gap-5">
                            <img className="w-10 h-10 object-contain opacity-70" src={order.items[0].product.image[0]} alt="boxIcon" />
                            <div className="flex flex-col gap-1">
                                {order.items.map((item, itemIdx) => (
                                    <p key={itemIdx} className="font-medium text-sm">
                                        {item.product.name} 
                                        <span className="text-primary ml-2">x {item.quantity}</span>
                                    </p>
                                ))}
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                    Status: 
                                    <span className="text-orange-500">{order.status}</span>

                                    {/* Toggle Button */}
                                    <button
                                        onClick={() => updateStatus(order._id, order.status)}
                                        className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                                    >
                                        Update
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Column 2: Address */}
                        <div className="text-xs leading-5">
                            <p className='font-bold text-gray-900 mb-1'>
                                {order.address.firstName} {order.address.lastName}
                            </p>
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                        </div>

                        {/* Column 3: Amount */}
                        <p className="font-bold text-lg text-gray-700">
                            {currency}{order.amount}
                        </p>

                        {/* Column 4: Payment Details */}
                        <div className="flex flex-col text-xs gap-1 border-l md:border-l-0 md:pl-0 pl-4 border-gray-200">
                            <p className="flex justify-between md:block">
                                <span className="text-gray-500">Method:</span> {order.paymentType}
                            </p>
                            <p className="flex justify-between md:block">
                                <span className="text-gray-500">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`w-2 h-2 rounded-full ${order.isPaid ? 'bg-green-500' : 'bg-red-500'}`}></span>

                                <p className="font-medium">
                                    {order.isPaid ? "Paid" : "Pending"}
                                </p>
                                {/* Toggle Button */}
                                <div className="flex items-center gap-2 mt-1">
                                    <label className="relative inline-flex items-center cursor-pointer ml-2">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={order.isPaid}
                                            onChange={() => togglePayment(order._id)}
                                        />

                                        {/* Track */}
                                        <div className={`
                                            w-10 h-5 rounded-full transition-colors duration-200
                                            ${order.isPaid ? 'bg-green-500' : 'bg-red-500'}
                                        `}></div>

                                        {/* Dot */}
                                        <span className={`
                                            absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full
                                            transition-transform duration-200 ease-in-out
                                            ${order.isPaid ? 'translate-x-5' : ''}
                                        `}></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;