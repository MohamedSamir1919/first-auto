import React, { useEffect, useState } from "react";
import axios from 'axios';
import { SEO } from "./SEO";
import { FaSpinner } from "react-icons/fa";

type Props = {
  slug: string
};
type arrtibutesType = {
  name: string
  value: string[] | number[],
  slug: string,
}
type IItem = {
  _id: string;
  title: string;
  description: string;
  stock: number;
  slug: string;
  img: string;
  colors?: string[];
  size?: string[];
  price: number;
  discount?: number;
  category: string;
};

const ProductDeatails = (props: Props) => {
  const [product, setProduct] = useState<IItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/products/${props.slug}`);
        if (res.status === 200) setProduct(res.data);
      } catch (err) {
        console.error("Error loading product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [props.slug]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <FaSpinner className="animate-spin text-4xl text-indigo-600" />
    </div>
  );

  if (!product) return <div className="text-center py-10">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title={product.title}
        description={product.description.substring(0, 160)}
        type="product"
        ogImage={`${product?.img}`}
        productData={product}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <img src={`${product?.img || 'https://via.placeholder.com/300'}`} alt={product.title} className="w-full h-auto" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="text-2xl font-bold text-indigo-600 mb-6">
            {product.price - (product.discount || 0)} EGP
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDeatails;
