import React from 'react';
import Skeleton from './Skeleton';

const ProductCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4 space-y-4">
            {/* Image placeholder */}
            <Skeleton className="w-full aspect-[4/3]" />

            <div className="space-y-2 flex-grow">
                {/* Title placeholder */}
                <Skeleton variant="text" className="w-3/4 h-6" />
                {/* Description placeholder */}
                <Skeleton variant="text" className="w-full h-4" />
                {/* Price and Button placeholder */}
                <Skeleton variant="text" className="w-1/2 h-5 mt-4" />
                <Skeleton className="w-full h-10 mt-2" />
            </div>
        </div>
    );
};

export default ProductCardSkeleton;