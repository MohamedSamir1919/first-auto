import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import data from '../fakeData.json'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next';

type Props = {

}
type IItem = {
    _id: string;
    title: string;
    description: string;
    slug: string;
    stock: number;
    img: string;
    price: number;
    colors: string[];
    size: string[];
    details?: {
        name: string;
        value: string;
    }[]; // Added details field
    discount?: number; // Added optional discount field as it's used in price calculation
}
type attributesType = {
    _id: string
    code: string;
    category: string;
    slug: string;
};
const Product = (props: Props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const [product, setProduct] = useState<IItem>()
    const [attributes, setAttributes] = useState<attributesType[]>();
    const [slug, setSlug] = useState<attributesType>();
    const [slugs, setSlugs] = useState<attributesType[]>();
    const [category, setCategory] = useState();
    const [items, setItems] = useState<IItem[]>();
    // State for user's selections for product details
    const [selectedDetails, setSelectedDetails] = useState({});
    const [quantity, setQuantity] = useState(1)
    const getCategory = async () => {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/category`)
        const productSlugObject = slugs?.find((s) => s._id == product?.slug);
        if (productSlugObject && res.data) {
            const foundCategory = res.data.find((c) => c._id == productSlugObject.category);
            setCategory(foundCategory);
        }
    }
    useEffect(() => {
        if (slugs && product) getCategory();
    }, [slugs, product])
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Initialize or reset selectedDetails when the product changes
    // useEffect(() => {
    //     if (product?.details && product.details.length > 0) {
    //         product.details.map(detail =>{
    //         const [[key, value]]= Object.entries(detail) 
    //         setSelectedDetails(
    //             {...selectedDetails,[key]:'' }
    //         )
    //         });
    //     } else {
    //         setSelectedDetails({}); // Reset if product has no details
    //     }
    // }, [product]);

    const handleDetailChange = (detailName: string, value: string) => {

        setSelectedDetails(
            Object.assign(selectedDetails, { [detailName]: value })
        );

    };

    const addToCart = () => {
        const allDetailsSelected = product?.details && product.details.length > 0
            ?
            product.details.every(d => {
                let [[key, value]] = Object.entries(d);
                return selectedDetails?.hasOwnProperty(key)

            })
            : true; // If no details are defined for the product, proceed

        if (allDetailsSelected && Cookies.get('token')) {
            const cartItem = { ...product, chosenDetails: selectedDetails, quantity: quantity };
            const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
            localStorage.setItem("cart", JSON.stringify([...currentCart, cartItem]));
            navigate('/cart');
        } else {
            window.alert("Please login, and select all available details");
        }
    };
    const getattributes = async () => {

        // GET SLUGS
        const res1 = await axios.get(
            `${import.meta.env.VITE_SERVER}/slug`

        )
        if (res1.status == 200 && res1.data) {
            if (product) {
                setSlug(res1.data.find((i: attributesType) => i._id == product.slug));
            }
            setSlugs(res1.data)
        }

    };
    useEffect(() => {
        getattributes();
    }, [product]);
    const getProduct = async () => {
        const currentProductId = location.pathname.split('/')[2];
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/products/get-one/${currentProductId}`); // Fetch specific product
        if (res.status == 200 && res.data) {
            setProduct(res.data)
        }
    }
    const getItems = async () => {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/products`);
        if (res.status == 200) {

            let its = res?.data.filter((i: IItem) => (
                category && product && i._id !== product._id && // Ensure category and product are defined, and item is not the current product
                slugs?.some((s) => (i.slug == s._id && s.category == category._id))
            ));
            if (its?.length > 0) {

                setItems(its)
                return its;
            }

        }
    }
    useEffect(() => {
        getProduct();
    }, [location])
    useEffect(() => {

        getItems()
    }, [slugs, category, product, location])


    return (
        <div className='w-full mt-[80px] bg-gray-50 py-8'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 items-start">
                    {/* Product Image */}
                    <div className="lg:col-span-1 flex justify-center p-4 bg-white rounded-lg shadow-md">
                        <img
                            className="max-w-full h-auto max-h-[500px] object-contain rounded-md"
                            src={product?.img ? `${product.img}` : '/placeholder.png'} // Added placeholder
                            alt={product?.title || 'Product image'}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-1 mt-8 lg:mt-0 p-6 bg-white rounded-lg shadow-md">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product?.title}</h1>

                        <p className="text-2xl font-semibold text-indigo-600 mb-4">
                            {product?.price ? `${(product.price - (product.discount || 0)).toFixed(2)} ${t("EGP")}` : 'Price not available'}

                        </p>

                        <div className="mb-4">
                            <h4 className="text-md font-semibold text-gray-700 mb-1">{t("Description")}:</h4>
                            <p className="text-gray-600 text-sm">{product?.description || "No description available."}</p>
                        </div>

                        {/* ------------ Product Details Section ------------ */}
                        {product?.details && product.details.length > 0 && (
                            <div className="my-5 border-t pt-4">
                                <h5 className="text-md font-semibold text-gray-700 mb-2">{t("Details")}:</h5>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    {product.details.map((detail) => {
                                        const [[key, value]] = Object.entries(detail);
                                        return (
                                            <li key={detail.name}>
                                                <span className="font-medium text-gray-800">{key}:</span> {value.split(',').join(', ')}
                                            </li>
                                        )
                                    }
                                    )}
                                </ul>
                            </div>
                        )}
                        {/* ------------end of details---------------- */}
                        {/* ------------ User Selectable Details ------------ */}
                        {product?.details && product.details.length > 0 &&
                            (
                                <div className="my-5 space-y-3 border-t pt-4">
                                    {product.details.map(detail => {
                                        const [[key, value]] = Object.entries(detail)

                                        return (
                                            <div key={detail.name} className="flex items-center">
                                                <label htmlFor={`detail-${key}`} className="mr-3 text-sm font-medium text-gray-700 w-24">{detail.name}:</label>
                                                <select
                                                    id={`detail-${key}`}
                                                    // value={value}
                                                    onChange={(e) => {
                                                        handleDetailChange(key, e.target.value)
                                                    }}
                                                    className="block w-full max-w-xs border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
                                                >
                                                    <option value="">Select {key}</option>
                                                    {value.split(',').map(option => (
                                                        <option key={option.trim()} value={option.trim()}>
                                                            {option.trim()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        {/* ------------ End User Selectable Details ------------ */}

                        <div className="mt-6 flex items-center space-x-4">
                            <label htmlFor="quantity" className="text-sm font-medium text-gray-700">{t("Quantity")}:</label>
                            <input
                                id="quantity"
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className='w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-center focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                                defaultValue={1}
                                type='number'
                                min="1"
                                max={product?.stock || 1} // Set max based on stock
                            />
                        </div>
                        <button
                            onClick={addToCart}
                            className='mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
                            disabled={!product || product.stock === 0} // Disable if no product or out of stock
                        >
                            {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* "You might like" Section */}
                {items && items.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">You Might Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.slice(0, 4).map((it: IItem) => (
                                <div key={it._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group">
                                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                                        <img
                                            className="w-full h-full object-cover object-center cursor-pointer group-hover:opacity-75 transition-opacity"
                                            onClick={() => { navigate(`/shopping/${it._id}`); window.scrollTo(0, 0); }}
                                            src={`${it.img}`}
                                            alt={it.title}
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="text-md font-semibold text-gray-800 truncate group-hover:text-indigo-600">{it.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 truncate">{it.description}</p>
                                        <p className="text-lg font-medium text-gray-900 mt-2">{`${(it.price - (it.discount || 0)).toFixed(2)} EGP`}</p>
                                        <button
                                            className="mt-auto w-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out mt-3"
                                            onClick={() => { navigate(`/shopping/${it._id}`); window.scrollTo(0, 0); }}
                                        >
                                            View Product
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reviews Section - Static Example */}
                {/* <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Customer Reviews</h2>
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <div className="border-b pb-4">
                        <div className="flex items-center mb-1">
                            <h3 className='font-semibold text-gray-800 mr-2'>Mohamed</h3>
                            <div className="flex text-yellow-400">
                                <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStarHalfAlt />
                            </div>
                        </div>
                        <p className='text-sm text-gray-600'>
                            It's good to use this cloth, this comfortable fabric made me do what I do with Agility in movement.
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center mb-1">
                            <h3 className='font-semibold text-gray-800 mr-2'>Mahmoud</h3>
                            <div className="flex text-yellow-400">
                                <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                            </div>
                        </div>
                        <p className='text-sm text-gray-600'>
                            I wondered this shirt is good for me, it's exactly beautiful.
                        </p>
                    </div>
                </div>
            </div> */}
            </div>
        </div>
    )
}

export default Product