import React, { useEffect, useState } from 'react'
import { CiDeliveryTruck } from 'react-icons/ci'
import { FaCheck } from 'react-icons/fa'
import { IoBagHandleSharp } from 'react-icons/io5'
import data from '../fakeData.json'
import Cookies from 'js-cookie'
import axios from 'axios'
type Props = {}
type IItem = {
    id: number;
    title: string;
    description: string;
    stock: number;
    slug: string;
    img: string;
    colors: string[];
    size: string[];
    price: number;
    category: string;
}

const Delivery = (props: Props) => {
    const [products, setProducts] = useState<IItem[]>([]);
    const [invoice, setInvoice] = useState();
    const [orders, setOrders] = useState([]);
    const token = Cookies.get("token")
    const cancelOrder = async (invoiceId) => {
        const cancelRes = await axios.post(`${import.meta.env.VITE_SERVER}/invoice/cancel/${invoiceId}`,
            {}, { headers: { Authorization: `Bearer ${token}` } })
        if (cancelRes.status == 200) {
            location.reload();
        }
    }
    const getProducts = async () => {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/products`)
        if (res.status == 200 && res.data?.length > 0) {
            setProducts(res.data)
        }
        else {
            console.log(res.data)
        }
    }
    const getOrdersAndInvoice = async () => {
        const myInvoiceRes = await axios.post(`${import.meta.env.VITE_SERVER}/invoice/my-invoice`, {}, {
            headers:
                { Authorization: `Bearer ${token}` }
        })
        if (myInvoiceRes.status == 200) {
            let sorted = myInvoiceRes.data.sort((a, b) => {
                if (a.status == "completed" && !b.status == "completed") {
                    return -1
                }
                else {
                    return 1
                }
            })
            setInvoice(myInvoiceRes.data)


            const myOrdersRes = await axios.post(`${import.meta.env.VITE_SERVER}/order/my-orders`, {}, {
                headers:
                    { Authorization: `Bearer ${token}` }
            })
            if (myOrdersRes.status == 200) {

                setOrders(myOrdersRes.data)
            } else {
                console.log(myOrdersRes)

            }
        }
    }
    useEffect(() => {
        getProducts()
        getOrdersAndInvoice()
    }, [])
    return (
        <div className='w-full  mt-[80px]'>
            <div className={`w-full flex justify-center flex-col items-center mb-4`}>
                <h1 className="outline text-3xl">Orders</h1>

                <hr className='w-[200px] border-0 h-[1px] bg-gray-200' />
            </div>
            <div className="w-full flex flex-col justify-center items-center    ">
                {
                    invoice?.filter((i) => { return i.status !== "canceled" })?.map((inv, ind) => <>


                        <div className={`flex flex-col items-center mb-8`}
                        >
                            <h5 className={`p-2 ${inv.paid > 0 ? "bg-gradient-to-tl from-green-400 to-green-800" : "bg-gradient-to-tl from-yellow-400 to-yellow-800"} rounded-lg`}
                            >{inv.paid > 0 ? `Paid` : "Not paid"}</h5>
                            <div className={`grid grid-cols-3 lg:grid-cols-8  grid-flow-row lg:gap-1 gap-x-2 px-6`}>
                                {
                                    (orders?.filter((o) => { return o.invoice == inv._id }).map((o) => (<div className={`relative flex flex-col  items-center col-span-1`}>
                                        <img src={`${products?.filter((p) => { return p.slug == o.slug })[0]?.img}`} className="w-[100px] h[180px]" />
                                        <h5 className="text-black ">{products?.filter((p) => { return p.slug == o.slug })[0]?.title}</h5>
                                        <h5 className="text-black ">Quantity:{o.quantity}</h5>
                                        <h5 className=" bottom-0 left-4">{parseInt(o.price)} EGP</h5>


                                    </div>)))
                                }
                            </div>

                            <div className='w-[90%] mt-4 mb-[100px] text-[24px] justify-center flex items-center '>
                                <div className={`p-1 rounded-[50%] relative
                     ${inv.status == 'order placed' ? "bg-[gold]" : "bg-green-300"} `}>

                                    <div className={`absolute top-[100%] 
                    font-black ${inv.status == 'order placed' ? "outline" : "text-black"} w-full h-full left-0
                     flex justify-center items-end rounded-[50%]`}>

                                        <h5 className="">Order Placed</h5>
                                    </div>
                                    <div className="rounded-[50%] bg-white p-1">
                                        <div className={`${inv.status == 'order placed' ? "bg-[gold]" : "bg-green-300"} rounded-[50%] p-2`}>
                                            <IoBagHandleSharp />
                                        </div>
                                    </div>
                                </div>


                                <div className={`w-[20vw] border-0 h-[3px] bg-gradient-to-r  ${inv.status == 'order placed'
                                    ? "to-green-300 from-[gold]" : inv.status == "on transit"
                                        ? "from-green-300 to-[gold]" : "bg-green-300"}`}></div>

                                <div className={`p-1 relative rounded-[50%] ${inv.status == 'on transit' ? "bg-[gold]" : "bg-green-300"}`}>

                                    <div className={`absolute top-[100%] text-[12px] 
                    font-black ${inv.status == 'on transit' ? "outline" : "text-black"} w-full h-full left-0
                     flex justify-center items-end  rounded-[50%]`}>
                                        <h5 className="">On Transit </h5>
                                    </div>
                                    <div className="rounded-[50%] bg-white p-1">
                                        <div className={`${inv.status == 'on transit' ? "bg-[gold]"
                                            : "bg-green-300"} rounded-[50%] p-2`}>
                                            <CiDeliveryTruck />
                                        </div>
                                    </div>
                                    <div className={`absolute`}>

                                    </div>
                                </div>
                                <div className={`w-[20vw] border-0 h-[3px] bg-gradient-to-r  ${inv.status == "on transit"
                                    ? "to-green-300 from-[gold]" : inv.status == "completed"
                                        ? "from-green-300 to-[gold]" : "bg-green-300"}`}>

                                </div>

                                <div className={`p-1 rounded-[50%] relative ${inv.status == 'completed' ? "bg-[gold]"
                                    : "bg-green-300"} `}>
                                    <div className={`absolute top-[100%] text-[12px] 
                    font-black ${inv.status == 'completed' ? "outline" : "text-black"} w-full h-full left-0
                     flex justify-center items-end rounded-[50%]`}>
                                        <h5 className="">Completed </h5>
                                    </div>
                                    <div className="rounded-[50%] bg-white p-1">
                                        <div className={`${inv.status == 'completed' ? "bg-[gold]"
                                            : "bg-green-300"}  rounded-[50%] p-2`}>

                                            <FaCheck />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="">
                                {inv.status == "order placed" ?
                                    <div
                                        onClick={() => {
                                            cancelOrder(inv._id);
                                        }}
                                        className="w-[100px] cursor-pointer p-2 bg-[red] rounded-lg flex justify-center items-center text-white">
                                        Cancel
                                    </div>
                                    : null
                                }
                            </div>

                            <hr className="w-[200px] bg-black h-[1px] border-0 mt-4" />
                        </div>

                    </>
                    )

                }

            </div>

        </div>
    )
}

export default Delivery