import React, { useEffect, useState } from 'react'
import data from '../fakeData.json'
import { CiHeart } from 'react-icons/ci'
import { FaCartPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useTranslation } from 'react-i18next';
import ProductCardSkeleton from './ProductCardSkeleton';

type Props = {}
type IItem = {
  _id: string;
  title: string;
  description: string;
  stock: number;
  slug: string;
  img: string;
  // colors: string[];
  // size: string[];
  published: boolean;
  price: number;
  category: string;
  createdAt: string;
};
const BestSell = (props: Props) => {
  const [products, setProducts] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState();
  const { t, i18n } = useTranslation();

  const getProducts = async () => {
    setLoading(true);
    try {
      const [ordRes, res] = await Promise.all([
        axios.get(`${import.meta.env.VITE_SERVER}/order/best-sell`),
        axios.get(`${import.meta.env.VITE_SERVER}/products`)
      ]);

      if (res.status === 200 && ordRes.status === 200) {
        setProducts(res.data.sort((a, b) => {
          const countA = ordRes.data.filter((o) => o.slug === a.slug).length;
          const countB = ordRes.data.filter((o) => o.slug === b.slug).length;
          if (countA > countB) {
            return -1;
          }
          else return 1;
        }));
      }
    } catch (error) {
      console.error("Error loading best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [])
  const navigate = useNavigate();
  return (
    <div className="w-full md:mt-[20px] mt-[40px] flex flex-col items-center">
      <h2 className="">{t("The Newest")}</h2>
      <hr className="w-[200px] h-[1px] bg-black" />
      <div className="w-full p-2  grid gap-x-2 gap-y-1 m-auto lg:grid-cols-4 align-center md:grid-cols-3 grid-cols-2 grid-flow-row ">
        {loading ? (
          [...Array(4)].map((_, index) => <ProductCardSkeleton key={index} />)
        ) : products?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).filter((p) => { return p.published }).map((item, index) => index > 11 ? null : (
          <div key={index} data-aos="fade-up" className='col-span-1 mx-auto  flex flex-col sm:w-[230px] w-[150px] rounded-xl'>
            <div className='relative h-[100%] flex justify-center rounded-xl'>
              <div className="lg:h-[300px] w-full md:h-[350px] sm:h-[350px] h-[230px]">
                <img onClick={() => navigate(`/shopping/${item._id}`)}
                  className='w-full h-full rounded-t-xl cursor-pointer' src={`${item.img || 'https://via.placeholder.com/300'}`} />

              </div>


              <div
                onClick={() => navigate(`/shopping/${item._id}`)}
                className='absolute w-full  md:flex hidden rounded-t-xl justify-center items-center h-full left-0 top-0
             hover:bg-[rgba(0,0,0,.5)] mr-2 md:opacity-0 opacity-100 hover:opacity-100'>

                {/* <FaCartPlus onClick={()=>navigate(`/shopping/${item.id}`)} 
                className=' cursor-pointer  text-white' /> */}
              </div>
            </div>
            <h3 className="text-[18px]">{item.title}</h3>
            <h6 className="text-[16px]">{`${item.description}`}</h6>
            <h6 className="text-[16px] font-gray-200">
              {parseInt(item.discount) > 0 ? <h6 ><span className="line-through">{parseInt(item.price)} </span>  {parseInt(item.price) - parseInt(item.discount)} <span className="pl-2">EGP</span></h6> : ` ${item.price} EGP`}
            </h6>
            <div onClick={() => navigate(`/shopping/${item._id}`)} className="bg-gradient-to-r cursor-pointer flex justify-center from-black to-gray-900 text-white p-2">
              Buy now
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export default BestSell