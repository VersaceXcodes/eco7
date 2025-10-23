import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const UV_EcoShop: React.FC = () => {
  // Local states
  const [products, setProducts] = useState<EcoShopProduct[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  // API call to fetch products from the eco shop
  const fetchProducts = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/eco-shop/products`, {
      params: { limit: 10, offset: 0 }
    });
    return data;
  };

  // React Query for fetching products
  const { data, error, isLoading } = useQuery('ecoShopProducts', fetchProducts);

  // Effect to update products state once the data is fetched
  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  // Add product to cart function
  const addToCart = (productId: string) => {
    setCart(prevCart => [...prevCart, productId]);
  };

  // Rendering component
  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Eco-Friendly Product Shop</h1>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="animate-spin h-6 w-6 border-4 border-blue-600 border-t-transparent rounded-full"></span>
          </div>
        ) : error ? (
          <div className="text-red-600">Error loading products. Please try again later.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.product_id} className="bg-white shadow-lg rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900">{product.product_name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-blue-600 font-semibold">${product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product.product_id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Add to Cart
                </button>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Vendor: {product.vendor}</p>
                  {product.rating && (
                    <p className="text-sm text-yellow-600">Rating: {product.rating}/5</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UV_EcoShop;