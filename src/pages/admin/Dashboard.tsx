import React, { useEffect, useState } from 'react'
import Wedgit from '../../components/admin/Wedgit';
import ChartsOverviewDemo from '../../components/admin/Chart';
import axios from 'axios';
import Cookies from 'js-cookie';

type Props = {}

const Dashboard = (props: Props) => {
  const [income,setIncome] = useState();
  const [orders,setOrders] = useState();
  const [users,setUsers] = useState();
  
  const getIncome = async()=>{
    const res = await axios.post(`${import.meta.env.VITE_SERVER}/invoice/get`,
      {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
      if(res.status == 200){
        setIncome(res.data)
      }
    }
  const getOrders = async()=>{
    const res = await axios.post(`${import.meta.env.VITE_SERVER}/order/get-orders`,
      {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
    if(res.status == 200){
      setOrders(res.data)
    }
  }
   const getUsers = async()=>{
    const res = await axios.post(`${import.meta.env.VITE_SERVER}/user/get-users`,
      {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
    if(res.status == 200){
      setUsers(res.data)
    }
  }
  
  useEffect(()=>{
    getIncome()
    getOrders()
    getUsers()
  },[])
  return (
    <div className="w-full mt-[100px] ml-[50px]">
        <div className="flex w-full  justify-evenly">

        <Wedgit title="Income" quantity={income?.reduce((total,curr)=>{
          return total + curr.paid
        },0)} target={50000} achieved={income?.filter((i)=>{return new Date(i.createdAt).getMonth() == new Date().getMonth() && new Date(i.createdAt).getFullYear() == new Date().getFullYear()})?.reduce((total,curr)=>{
          return total + curr.paid
        },0)}/>
        <Wedgit title="Users" quantity={users?.length} target={20} 
        achieved={
          users?.filter(
          (i)=>{return new Date(i.createdAt).getMonth() == new Date().getMonth()
           && new Date(i.createdAt).getFullYear() == new Date().getFullYear()}).length
          }
           />
        <Wedgit title="Orders" quantity={orders?.length} target={50} achieved={orders?.filter((i)=>{return new Date(i.createdAt).getMonth() == new Date().getMonth() && new Date(i.createdAt).getFullYear() == new Date().getFullYear()}).length}/>
        </div>
        <div className="mt-8">

        <ChartsOverviewDemo />
        </div>
    </div>
  )
}

export default Dashboard