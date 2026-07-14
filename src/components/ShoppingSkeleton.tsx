import React from 'react';
import ProductCardSkeleton from './ProductCardSkeleton';
import Skeleton from './Skeleton';

const ShoppingSkeleton: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-20 w-full mb-8 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {[...Array(8)].map((_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};

export default ShoppingSkeleton;