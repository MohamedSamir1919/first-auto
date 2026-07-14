import React, { useState } from 'react'
import { CiDeliveryTruck, CiSettings } from 'react-icons/ci';
import { FaMoneyBill, FaProductHunt, FaSellcast, FaUsers } from 'react-icons/fa';
import { LuContainer } from 'react-icons/lu';
import { MdDashboard } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BiCollection } from "react-icons/bi";
type Props = {}

const Nav = (props: Props) => {
        const [openNav, setOpenNav] = useState(false);
        const navigate = useNavigate();
        return (
                <div className={`w-[200px] fixed  transition-all duration-1000 z-[2000]  h-full
     bg-white border-r-[1px] border-black 
      flex flex-col  ${openNav ? "left-0" : "left-[-160px] shadow-xl"}`}>
                        <div onClick={() => { setOpenNav(!openNav) }} className={`flex ${openNav ? 'mr-4' : ""} cursor-pointer p-1 justify-between`}>
                                <h1 className="outline text-[24px]">Mo Sa</h1>
                                <div
                                        className=" transition-all duration-1000 relative flex flex-col pt-2 ">
                                        <div className={`w-[20px] h-[3px]
                     transition-all duration-1000 mb-1 bg-black 
                     ${openNav ? "absolute bottom-4 left-0 rotate-[45deg] w-[20px]" : "rotate-0"}`}></div>
                                        <div className={`w-[20px] h-[3px] mb-1
                     bg-black ${openNav ? "hidden" : "rotate-0"}`}></div>
                                        <div className={`w-[20px] h-[3px] 
                    transition-all duration-1000 bg-black  mb-1
                    ${openNav ? "absolute bottom-4 left-0 w-[20px] rotate-[135deg]" : "rotate-0"}`}></div>
                                </div>
                        </div>
                        <hr className="w-full h-[1px] bg-[gray]" />
                        <div
                                onClick={() => navigate('/admin')}
                                className="w-full mr-4 cursor-pointer p-1 text-gray-700 flex justify-between items-center">
                                <h5 className="text-[14px]">Dashboard</h5>
                                <MdDashboard />


                        </div>
                        <hr className="w-full h-[1px] bg-[gray]" />
                        <div onClick={() => navigate('/admin/products')} className="w-full mr-4 cursor-pointer p-1 text-gray-700 flex justify-between items-center">
                                <h5 className="text-[14px]">Products</h5>
                                <FaProductHunt />
                        </div>
                        <div
                                onClick={() => navigate('/admin/sells')}



                                className="w-full mr-4 cursor-pointer p-1 text-gray-700 flex justify-between ">
                                <h5 className="text-[14px]">Sells</h5>
                                <FaSellcast />
                        </div>
                        <hr className="w-full h-[1px] bg-[gray]" />
                        <div
                                onClick={() => navigate('/admin/orders')}

                                className="w-full mr-4 cursor-pointer p-1 text-gray-700 flex justify-between ">
                                <h5 className="text-[14px]">Orders</h5>
                                <LuContainer />

                        </div>
                        <div
                                onClick={() => navigate('/admin/users')}

                                className="w-full mr-4 cursor-pointer p-1 text-gray-700 flex justify-between ">
                                <h5 className="text-[14px]">Users</h5>
                                <FaUsers />
                        </div>
                        <div
                                onClick={() => navigate('/admin/settings')}

                                className="w-full mr-4 cursor-pointer p-1 text-gray-700 flex justify-between ">
                                <h5 className="text-[14px]">Setting</h5>
                                <CiSettings />
                        </div>
                        <div
                                onClick={() => navigate('/admin/collections')}

                                className="w-full mr-4 cursor-pointer p-1 text-gray-700 flex justify-between ">
                                <h5 className="text-[14px]">Collection</h5>
                                <BiCollection />
                        </div>

                </div>
        )
}

export default Nav