import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams, Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import Productcard from '../component/Productcard'
const ProductDetail = () => {
    const { products, addToCart ,navigate  } = useAppContext();
    const { id } = useParams();

    // Find the specific product based on URL ID
    const product = products.find((item) => item._id === id);

    // State Management
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    // Effect to handle Related Products logic
    useEffect(() => {
        if (products.length > 0 && product) {
            const filtered = products.filter(
                (item) => item.category === product.category && item._id !== id
            );
            setRelatedProducts(filtered.slice(0, 5));
        }
    }, [products, product, id]);

    // Effect to update thumbnail when product changes
    useEffect(() => {
        if (product && product.image && product.image.length > 0) {
            setThumbnail(product.image[0]);
        }
    }, [product]);

    // Early return if product is not found yet
    if (!product) {
        return <div className="mt-12 text-center">Loading product...</div>;
    }

    return (
        <div className="mt-12 px-4 md:px-0">
            {/* Breadcrumbs */}
            <p className="text-sm text-gray-600">
                <Link to="/" className="hover:underline">Home</Link> / 
                <Link to="/products" className="hover:underline"> Products</Link> / 
                <Link to={`/products?category=${product.category}`} className="hover:underline"> {product.category}</Link> / 
                <span className="text-primary font-medium"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-16 mt-6">
                {/* Image Section */}
                <div className="flex flex-1 gap-3">
                    <div className="flex flex-col gap-3">
                        {product.image?.map((img, index) => (
                            <div 
                                key={index} 
                                onClick={() => setThumbnail(img)} 
                                className={`border max-w-24 rounded overflow-hidden cursor-pointer transition ${thumbnail === img ? 'border-indigo-500' : 'border-gray-500/30'}`}
                            >
                                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full" />
                            </div>
                        ))}
                    </div>

                    <div className="border border-gray-500/30 flex-1 rounded overflow-hidden bg-gray-50">
                        <img src={thumbnail} alt={product.name} className="w-full h-auto object-cover" />
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 text-sm">
                    <h1 className="text-3xl  font-medium">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-0.5 mt-2">
                     {/* Create an array of 5 elements to map through */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <img 
                            key={i} 
                            className="md:w-4 w-3" 
                            src={i < product.rating ? assets.star_icon : assets.star_dull_icon} 
                            alt="star" 
                        />
                    ))}
                    
                    <p className="text-base ml-2">{product.rating}</p>
                </div>
                    {/* Pricing */}
                    <div className="mt-6">
                        <p className="text-gray-500 line-through">MRP: {product.price}</p>
                        <p className="text-2xl font-semibold text-indigo-600">${product.offerPrice}</p>
                        <span className="text-gray-400 text-xs">(inclusive of all taxes)</span>
                    </div>

                    {/* Description */}
                    <p className="text-base font-medium mt-6">About Product</p>
                    <ul className="list-disc ml-4 mt-2 text-gray-600 space-y-1">
                        {product.description?.map((desc, index) => (
                            <li key={index}>{desc}</li>
                        ))}
                    </ul>

                    {/* Action Buttons */}
                    <div className="flex items-center mt-10 gap-4">
                        <button 
                            onClick={() => addToCart(product._id)}
                            className="w-full py-3.5 rounded-md font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                        >
                            Add to Cart
                        </button>
                        <button  onClick={() => {addToCart(product._id); navigate("/cart")}} className="w-full py-3.5 rounded-md font-medium bg-primary hover:bg-[#059b5a] text-white transition">
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/* releted products */}
            <div className='flex flex-col items-center mt-20'>
                <div className='flex flex-col items-center w-max'>
                    <p className='text-3xl font-medium'>Releted Products</p>
                    <div className=' w-20 h-0.5 bg-primary rounded-full mt-2' ></div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-10 lg:grid-cols-5 mt-6 w-full'>
                    {relatedProducts.filter((product)=> product.inStock).map((product,index)=>(
                        <Productcard key={index} product={product} />
                    ))}
                </div>
                     
                <button onClick={()=> {navigate("/products"); scrollTo(0,0)}} className='mx-auto cursor-pointer px-12 my-16 py-2.5 border rounded text-primary hover:bg-primary/10 transition '>see more</button>
            </div>
        </div>
    );
};

export default ProductDetail;