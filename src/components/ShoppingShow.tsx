import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SEO } from './SEO';
import ShoppingSkeleton from './ShoppingSkeleton';

interface IItem {
    _id: string;
    title: string;
    description: string;
    img: string;
    price: number;
    discount?: number;
    stock: number;
    slug: string; // الـ ID الخاص بالـ Slug المرتبط بالمنتج
    colors: string[];
    size: string[];
    published?: boolean;
    details?: {
        name: string;
        value: string;
    }[];
    createdAt: string;
}

interface ISlug {
    _id: string;
    category: string;
}

interface ICategory {
    _id: string;
    name: string;
}

// واجهة تعريف الكوليكشن بناءً على الموديل الخاص بك
interface ICollection {
    _id: string;
    name: string;
    arabicName?: string;
    img?: string;
    active?: boolean;
    slug: string[]; // مصفوفة تحتوي على الـ ObjectIds للـ Slugs المرتبطة بها
}

const ShoppingShow: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const catQuery = searchParams.get('cat');

    // Products Data States
    const [originalProducts, setOriginalProducts] = useState<IItem[]>([]);
    const [slugs, setSlugs] = useState<ISlug[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    // ✨ [جديد] لتخزين الكوليكشنز القادمة من السيرفر
    const [collections, setCollections] = useState<ICollection[]>([]);

    // Status States
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Filter and sort controls states
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('default');

    // State للبحث باسم المنتج
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Fetch initial data (Products, Slugs, Categories, Collections)
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                // ✨ تم جلب الـ collections بالتوازي مع بقية الـ APIs
                const [productsRes, slugsRes, catsRes, collectionsRes] = await Promise.all([
                    axios.get<IItem[]>(`${import.meta.env.VITE_SERVER}/products`),
                    axios.get<ISlug[]>(`${import.meta.env.VITE_SERVER}/slug`),
                    axios.get<ICategory[]>(`${import.meta.env.VITE_SERVER}/category`),
                    axios.get<ICollection[]>(`${import.meta.env.VITE_SERVER}/collection`)
                ]);

                if (productsRes.status === 200) setOriginalProducts(productsRes.data);
                if (slugsRes.status === 200) setSlugs(slugsRes.data);
                if (catsRes.status === 200) setCategories(catsRes.data);
                if (collectionsRes.status === 200) setCollections(collectionsRes.data);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError('Failed to load shop items. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Compute filtered products on the fly using useMemo
    const filteredProducts = useMemo(() => {
        let result = [...originalProducts];

        // 1. Apply Search Term (Title) Filter
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase().trim();
            result = result.filter((p) => p.title.toLowerCase().includes(query));
        }

        // 2. ✨ [تعديل] البحث في الـ Category أو الـ Collection بالتبادل
        if (catQuery && catQuery !== 'default') {
            const activeCategory = categories.find(
                (c) => c.name.toLowerCase() === catQuery.toLowerCase()
            );

            if (activeCategory) {
                // أ) لو اتلقى في الـ Category: جلب السلاجز التابعة للـ Category
                const matchingSlugIds = slugs
                    .filter((s) => s.category === activeCategory._id)
                    .map((s) => s._id);

                result = result.filter((p) => matchingSlugIds.includes(p.slug));
            } else {
                // ب) لو ملقهاش في الـ Category: ابحث في الـ Collections
                const activeCollection = collections.find(
                    (col) => col.name.toLowerCase() === catQuery.toLowerCase()
                );

                if (activeCollection) {
                    // الـ Collection تحتفظ بمصفوفة slugs مباشرة من الـ DB
                    const collectionSlugIds = activeCollection.slug || [];

                    // فلترة المنتجات التي ينتمي الـ slug الخاص بها لهذه المجموعة
                    result = result.filter((p) => collectionSlugIds.includes(p.slug));
                } else {
                    // ج) لو ملقهاش لا هنا ولا هنا، رجّع مصفوفة فارغة
                    result = [];
                }
            }
        }

        // 3. Apply Price Filters
        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (!isNaN(min)) {
            result = result.filter(p => (p.price - (p.discount || 0)) >= min);
        }
        if (!isNaN(max)) {
            result = result.filter(p => (p.price - (p.discount || 0)) <= max);
        }

        // 4. Apply Sorting
        if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'priceLowToHigh') {
            result.sort((a, b) => (a.price - (a.discount || 0)) - (b.price - (b.discount || 0)));
        } else if (sortBy === 'priceHighToLow') {
            result.sort((a, b) => (b.price - (b.discount || 0)) - (a.price - (a.discount || 0)));
        }

        return result;
        // أضفنا الـ collections في مصفوفة الاعتماديات للـ useMemo
    }, [originalProducts, slugs, categories, collections, catQuery, minPrice, maxPrice, sortBy, searchTerm]);


    if (loading) {
        return <ShoppingSkeleton />;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500 text-lg">{error}</div>;
    }

    if (originalProducts.length === 0 && !loading) {
        return <div className="text-center py-10 text-gray-600 text-lg">No products found.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SEO
                title={catQuery ? `"Shop" - ${catQuery}` : "Shop All Products"}
                description="Discover our latest collection of high-quality products. Shop now for the best deals at SaSha Store."
                keywords={`shopping, fashion, online store, ${catQuery || 'men, women'}`}
            />

            {/* Filter and Sort Controls */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow space-y-4">

                {/* بار البحث */}
                <div className="w-full">
                    <label htmlFor="searchProduct" className="block text-sm font-medium text-gray-700">Search Products</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            id="searchProduct"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Type product name to search..."
                            className="block w-full border border-gray-300 rounded-md py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* باقي الفلاتر (تم تصليح خطأ الـ onChange المكسور في الكود القديم) */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end pt-2 border-t border-gray-100">
                    <div>
                        <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price (EGP)</label>
                        <input
                            type="number"
                            id="minPrice"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="e.g., 50"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price (EGP)</label>
                        <input
                            type="number"
                            id="maxPrice"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="e.g., 500"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="default">Default</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="priceLowToHigh">Price: Low to High</option>
                            <option value="priceHighToLow">Price: High to Low</option>
                        </select>
                    </div>

                    <div>
                        {/* قائمة الاختيار تجمع التصنيفات والكوليكشنز معاً لسهولة التصفح */}
                        <label htmlFor="categorySelect" className="block 
                        text-sm font-medium text-gray-700">Categories</label>
                        <select
                            id="categorySelect"
                            value={catQuery || 'default'}
                            onChange={(e) => {
                                if (e.target.value === 'default') {
                                    navigate('/shopping');
                                } else {
                                    navigate(`/shopping?cat=${e.target.value}`);
                                }
                            }}
                            className="mt-1 block w-full border border-gray-300 bg-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="default">Default</option>

                            {/* عرض الـ Categories */}
                            {categories?.length > 0 && (
                                <optgroup label="Categories">
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </optgroup>
                            )}


                        </select>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                    {filteredProducts.filter((p) => p.published !== false).map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 text-lg">No Items Found</div>
            )}
        </div>
    );
};

export default ShoppingShow;