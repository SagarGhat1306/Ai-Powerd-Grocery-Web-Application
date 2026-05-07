import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
const AddAddress = () => {
    const { backendUrl, navigate } = useAppContext();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Remove error when typing
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // ✅ Validation Function
  const validate = () => {
    let newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const onSubmitHandler = async (e) => {
  e.preventDefault();

  // ✅ Validate before API call
  if (!validate()) {
    toast.error("Please fill all required fields");
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/api/address/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // ✅ VERY IMPORTANT for cookies
      body: JSON.stringify({
        ...formData,
        zipcode: formData.zipCode // backend expects zipcode
      })
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Address added successfully");

      navigate('/cart')
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
      

      setErrors({});
    } else {
      toast.error(data.message);
    }

  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};

  return (
    <div className="mt-16 px-4 md:px-16 lg:px-24 xl:px-32 pb-20">
      <div className="flex flex-col md:flex-row gap-12 items-start justify-between">
        
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-medium text-primary mb-2">Add Shipping Address</h2>
          <p className="text-slate-400 text-sm mb-8">Please enter the details where you want your products delivered.</p>
          
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">

            {/* First & Last */}
            <div className="flex gap-4">
              <div className="w-full">
                <input 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2.5 ${errors.firstName ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                  type="text" placeholder="First Name"
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>

              <div className="w-full">
                <input 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2.5 ${errors.lastName ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                  type="text" placeholder="Last Name"
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded-md px-4 py-2.5 ${errors.email ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                type="email" placeholder="Email Address"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Street City State */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <input 
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2.5 ${errors.street ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                  type="text" placeholder="Street Address"
                />
                {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}
              </div>

              <div className="w-1/4">
                <input 
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2.5 ${errors.city ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                  type="text" placeholder="City"
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>

              <div className="w-1/4">
                <input 
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2.5 ${errors.state ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                  type="text" placeholder="State"
                />
                {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
              </div>
            </div>

            {/* Zip Country Phone */}
            <div className="flex gap-4">
              <div className="w-1/4">
                <input 
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2.5 ${errors.zipCode ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                  type="number" placeholder="Zip"
                />
                {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
              </div>

              <div className="w-1/4">
                <input 
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2.5 ${errors.country ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                  type="text" placeholder="Country"
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>

              <div className="w-1/2">
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-4 py-2.5 ${errors.phone ? 'border-red-500' : 'border-slate-600'} bg-transparent text-gray-400`}
                  type="tel" placeholder="Phone Number"
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
            </div>

            <button 
              type="submit"
              onClick={onSubmitHandler}
              className="mt-4 bg-white hover:bg-slate-200 text-black font-medium py-3 rounded-md transition-all active:scale-95"
            >
              Save Address
            </button>
          </form>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative group">
            <img 
              src={assets.add_address_iamge} 
              alt="Shipping illustration" 
              className="relative max-w-xs sm:max-w-sm lg:max-w-md rounded-lg"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddAddress;