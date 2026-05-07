import React, { useState, useCallback } from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

const AddProduct = () => {

    const { backendUrl } = useAppContext();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');

    const [images, setImages] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    // ✅ DROPZONE LOGIC
    const onDrop = useCallback((acceptedFiles) => {
        if (images.length + acceptedFiles.length > 4) {
            toast.error("Max 4 images allowed");
            return;
        }

        setImages(prev => [...prev, ...acceptedFiles]);
    }, [images]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        multiple: true
    });

    // REMOVE IMAGE
    const removeImage = (index) => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!name || !description || !category || !price || !offerPrice) {
            setErrorMsg("All fields are required");
            return;
        }

        if (images.length === 0) {
            setErrorMsg("At least one image is required");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", JSON.stringify(description));
            formData.append("category", category);
            formData.append("price", price);
            formData.append("offerPrice", offerPrice);
            formData.append("inStock", true);

            images.forEach((img, index) => {
                formData.append(`image${index + 1}`, img);
            });

            const response = await fetch(`${backendUrl}/api/product/add`, {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);

                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setImages([]);
                setErrorMsg('');
            } else {
                setErrorMsg(data.message);
                toast.error(data.message);
            }

        } catch (error) {
            setErrorMsg("Error adding product");
            toast.error("Error adding product");
        }
    };

    return (
        <div className="no-scrollbar flex-1 flex-col h-[95vh] overflow-scroll justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">

                {/* ERROR */}
                {errorMsg && (
                    <p className="text-red-500 text-sm font-medium">{errorMsg}</p>
                )}

                {/* 🔥 DRAG & DROP AREA */}
                <div>
                    <p className="text-base font-medium mb-2">Product Image</p>

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed p-6 rounded cursor-pointer text-center transition
                        ${errorMsg && images.length === 0 ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <input {...getInputProps()} />

                        {isDragActive ? (
                            <p>Drop images here...</p>
                        ) : (
                            <p>Drag & drop images here, or click to select (Max 4)</p>
                        )}
                    </div>

                    {/* PREVIEW */}
                    <div className="flex gap-3 mt-3 flex-wrap">
                        {images.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(img)}
                                    className="w-24 h-24 object-cover rounded border"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SAME FORM (UNCHANGED UI) */}

                <div className="flex flex-col gap-1 max-w-md">
                    <label>Product Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`border px-3 py-2 rounded ${errorMsg && !name ? 'border-red-500' : ''}`}
                    />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`border px-3 py-2 rounded ${errorMsg && !description ? 'border-red-500' : ''}`}
                    />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label>Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`border px-3 py-2 rounded ${errorMsg && !category ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select</option>
                        {categories.map((item, i) => (
                            <option key={i} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className={`border px-3 py-2 rounded ${errorMsg && !price ? 'border-red-500' : ''}`}
                    />
                    <input
                        type="number"
                        placeholder="Offer Price"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        className={`border px-3 py-2 rounded ${errorMsg && !offerPrice ? 'border-red-500' : ''}`}
                    />
                </div>

                <button className="px-6 py-2 bg-primary text-white rounded">
                    ADD PRODUCT
                </button>
            </form>
        </div>
    );
};

export default AddProduct;