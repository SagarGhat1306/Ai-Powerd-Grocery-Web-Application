import React from "react";
import { useAppContext } from '../context/AppContext'
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
const ProductList = () => {

    const { products, currency, backendUrl, fetchProducts, navigate } = useAppContext();
    const [editProduct, setEditProduct] = React.useState(null);
    const [formData, setFormData] = React.useState({});

    const openEdit = (product) => {
        setEditProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            offerPrice: product.offerPrice,
            description: product.description.join(", ")
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const updateProduct = async () => {
        try {
            const res = await fetch(`${backendUrl}/api/product/update/${editProduct._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    description: JSON.stringify(formData.description.split(","))
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Updated");
                setEditProduct(null);
                fetchProducts();
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error("Update failed");
        }
    };

    // ✅ DELETE PRODUCT
    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`${backendUrl}/api/product/delete/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    // ✅ TOGGLE STOCK
    const toggleStock = async (id, currentStock) => {
        try {
            const res = await fetch(`${backendUrl}/api/product/change-stock`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    id,
                    inStock: !currentStock
                })
            });

            const data = await res.json();

            if (data.success) {
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Stock update failed");
        }
    };

    return (
        <div className="flex-1 py-10 flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
                <h2 className="pb-4 text-lg font-medium">All Products</h2>

                <div className="flex flex-col items-center  max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                    <table className="md:table-auto table-fixed w-full overflow-hidden">

                        <thead className="text-gray-900 text-sm text-left">
                            <tr>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3 hidden md:block">Selling Price</th>
                                <th className="px-4 py-3">In Stock</th>
                                {/* ✅ NEW COLUMN */}
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm text-gray-500">
                            {products.map((product) => (
                               <tr key={product._id} className="border-t border-gray-500/20">

                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image[0]} className="w-16 border rounded" />
                                            <span className="truncate">{product.name}</span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">{product.category}</td>

                                    <td className="px-4 py-3 hidden md:table-cell">
                                        {currency}{product.offerPrice}
                                    </td>

                                    {/* ✅ FIXED TOGGLE (your original style) */}
                                    <td className="px-4 py-3">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={product.inStock}
                                                onChange={() => toggleStock(product._id, product.inStock)}
                                            />
                                            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-primary transition"></div>
                                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => openEdit(product)}
                                                className="text-blue-500 hover:scale-110 transition"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() => deleteProduct(product._id)}
                                                className="text-red-500 hover:scale-110 transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {editProduct && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                <div className="bg-white p-6 rounded w-full max-w-md space-y-3">

                    <h2 className="text-lg font-semibold">Edit Product</h2>

                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border w-full p-2 rounded"
                        placeholder="Name"
                    />

                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="border w-full p-2 rounded"
                        placeholder="Category"
                    />

                    <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="border w-full p-2 rounded"
                        placeholder="Price"
                    />

                    <input
                        name="offerPrice"
                        value={formData.offerPrice}
                        onChange={handleChange}
                        className="border w-full p-2 rounded"
                        placeholder="Offer Price"
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="border w-full p-2 rounded"
                        placeholder="comma separated"
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            onClick={() => setEditProduct(null)}
                            className="px-4 py-2 border rounded"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={updateProduct}
                            className="px-4 py-2 bg-primary text-white rounded"
                        >
                            Update
                        </button>
                    </div>

                </div>
            </div>
    )}
        </div>
    );
};

export default ProductList;