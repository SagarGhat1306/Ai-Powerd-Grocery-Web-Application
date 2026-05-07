import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
  return (
    <div className="relative w-full">
      
      {/* Banner Images */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="w-full hidden md:block"
      />

      <img
        src={assets.main_banner_bg_sm}
        alt="banner"
        className="w-full md:hidden"
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center px-6 md:pl-20 lg:pl-28">

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-xs md:max-w-md lg:max-w-xl leading-tight">
          Freshness You Can Trust, Savings You will Love!
        </h1>

        {/* Buttons */}
        <div className="flex items-center gap-6 mt-6">

          <Link
            to="/products"
            className="flex items-center gap-2 px-7 md:px-9 py-3 bg-primary hover:bg-primary-dull transition rounded-xl text-white font-medium"
          >
            Shop Now
            <img
              src={assets.white_arrow_icon}
              alt="arrow"
              className="w-4"
            />
          </Link>

          <Link
            to="/products"
            className="hidden md:flex items-center gap-2 font-medium"
          >
            Explore deals
            <img
              src={assets.black_arrow_icon}
              alt="arrow"
              className="w-4"
            />
          </Link>

        </div>

      </div>

    </div>
  );
};

export default MainBanner;