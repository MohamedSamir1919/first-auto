import React from 'react';
import { useNavigate } from 'react-router';

interface IItem {
    _id: string;
    title: string;
    description: string;
    img: string;
    price: number;
    discount?: number; // Made discount optional
    stock: number;
    // Add other fields if needed for display on the card, e.g., category, rating
}

type ProductCardProps = {
    product: IItem;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();

    const displayPrice = product.price - (product.discount || 0);
    const hasDiscount = product.discount && product.discount > 0;

    const handleNavigate = () => {
        navigate(`/shopping/${product._id}`);
        window.scrollTo(0, 0);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer" onClick={handleNavigate}>
                <img
                    src={`${product?.img || 'https://via.placeholder.com/300'}`}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Out of Stock</div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg flex-wrap font-semibold text-gray-800 mb-1  group-hover:text-indigo-600 transition-colors" title={product.title}>
                    {product.title}
                </h3>
                {/* <p className="text-sm text-gray-600 mb-2 h-10 overflow-hidden">{product.description}</p> */}
                <div className="mt-auto">
                    <div className="flex items-baseline mb-3">
                        {hasDiscount ? (
                            <>
                                <p className="text-sm text-gray-500 line-through mr-2">{product.price.toFixed(2)} EGP</p>
                                <p className="text-xl font-bold text-indigo-600">{displayPrice.toFixed(2)} EGP</p>
                            </>
                        ) : (
                            <p className="text-xl font-bold text-indigo-600">{displayPrice.toFixed(2)} EGP</p>
                        )}
                    </div>
                    <button
                        onClick={handleNavigate}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-150 ease-in-out disabled:opacity-50"
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'View Details'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;