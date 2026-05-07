import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Productcard = ({ product }) => {

  const {
    cartItems,
    currency,
    addToCart,
    removeCartItem,
    navigate
  } = useAppContext();

  return (
    <div
      onClick={() => {
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
        scrollTo(0, 0);
      }}
      className="border border-gray-200 rounded-lg p-3 bg-white w-full max-w-[220px] flex flex-col justify-between hover:shadow-md transition"
    >

      {/* ✅ IMAGE FIXED BOX */}
      <div className="w-full h-[140px] flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
        <img
          src={product?.image?.[0]}
          alt={product?.name}
          className="h-full w-full object-contain group-hover:scale-105 transition"
        />
      </div>

      {/* DETAILS */}
      <div className="mt-3 text-sm flex flex-col flex-1 justify-between">

        <div>
          <p className="text-gray-400 text-xs">{product?.category}</p>

          <p className="text-gray-800 font-medium text-base truncate">
            {product?.name}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mt-1">
            {Array(5).fill("").map((_, i) => (
              <img
                key={i}
                className="w-3"
                src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                alt="star"
              />
            ))}
            <p className="text-xs text-gray-400">(4)</p>
          </div>
        </div>

        {/* PRICE + CART */}
        <div className="flex items-end justify-between mt-3">

          <p className="text-lg font-semibold text-primary">
            {currency}{product?.offerPrice}
            <span className="ml-1 text-xs text-gray-400 line-through">
              {currency}{product?.price}
            </span>
          </p>

          {/* CART */}
          <div onClick={(e) => e.stopPropagation()}>

            {!cartItems[product._id] ? (
              <button
                className="flex items-center gap-1 bg-indigo-100 border border-indigo-300 px-2 py-1 rounded text-xs font-medium"
                onClick={() => addToCart(product._id)}
              >
                <img src={assets.cart_icon} className="w-4" />
                Add
              </button>
            ) : (
              <div className="flex items-center gap-2 px-2 py-1 bg-indigo-500/20 rounded text-sm">

                <button
                  onClick={() => removeCartItem(product._id)}
                  className="px-1"
                >
                  -
                </button>

                <span>{cartItems[product._id]}</span>

                <button
                  onClick={() => addToCart(product._id)}
                  className="px-1"
                >
                  +
                </button>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Productcard;