"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link"; // Next.js Link
// import { useCart } from "../Context/CartContext"; // Adjust path if necessary

interface Product {
  _id: string;
  name: string;
  description: string;
  company: string;
  imageUrl: string;
  cost: number;
  MRP: number;
  ratings: { rating: number }[];
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const { cart, addToCart, updateQuantity } = useCart(); // Using cart context

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products', {
          withCredentials: true, // If your backend uses cookies
        });
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductQuantity = (_productId: string) => {
    // const cartItem = cart.find(item => item._id === _productId);
    // return cartItem ? cartItem.quantity : 0;
  };

  const calculateDiscount = (cost: number, MRP: number) => {
    const discount = ((MRP - cost) / MRP) * 100;
    return discount.toFixed(0);
  };

  return (
    <div className="container px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Products</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-md p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const quantity = getProductQuantity(product._id);
          const discount = calculateDiscount(product.cost, product.MRP);

          return (
            <Link key={product._id} href={`/products/${product._id}`}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between h-full relative">
                {/* Discount Badge */}
                {parseInt(discount) > 0 && (
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-sm px-2 py-1 rounded">
                    {discount}% off
                  </span>
                )}

                {/* Product Image */}
                <img src={product.imageUrl} alt={product.name} className="mb-4 w-full h-40 object-cover rounded" />

                {/* Product Title */}
                <h2 className="text-l font-bold">{product.name}</h2>

                {/* Company Name */}
                <p className="text-gray-600 text-sm">{product.company}</p>

                {/* Rating */}
                {/* <div className="flex items-center">
                  <span className="text-yellow-500 mr-1">&#9733;</span>
                  <span className="text-sm">
                    {(product.ratings.length > 0 ? (product.ratings.reduce((acc, r) => acc + r.rating, 0) / product.ratings.length).toFixed(1) : 'No Ratings')}
                  </span>
                  <span className="text-gray-500 text-xs ml-1">({product.ratings.length})</span>
                </div> */}

                {/* cost */}
                <div className="flex items-center mt-auto">
                  <span className="text-xl font-semibold">₹{product.cost}</span>
                  <span className="line-through text-gray-500 text-sm ml-2">₹{product.MRP}</span>
                </div>

                {/* Cart Actions */}
                {/* <div className="mt-auto">
                  {quantity > 0 ? (
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => updateQuantity(product._id, -1)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-l-md transition duration-300 hover:bg-blue-600 text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-lg">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product._id, 1)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-r-md transition duration-300 hover:bg-blue-600 text-sm"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-600 w-full text-center text-sm mt-2"
                    >
                      Add to Cart
                    </button>
                  )}
                </div> */}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
