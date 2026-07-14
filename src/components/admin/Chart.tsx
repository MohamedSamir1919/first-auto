import  React ,{useState, useEffect} from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function ChartsOverviewDemo() {
  const [income,setIncome] = useState();
    const [orders,setOrders] = useState();
    const [users,setUsers] = useState();
    const [visitors,setVisitors] = useState();
          const [actions,setActions] = useState();
    
    const [actionVisit, setActionVisit] = useState([]);
     const getAction = async()=>{
            const res = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/actions`,
              {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
            if(res.status == 200){
              setActions(res.data.filter(
                (i)=>{return new Date(i.createdAt).getFullYear() == new Date().getFullYear()})
                )
            }
          }
  useEffect(()=>{
                      
  setActionVisit([...new Map(actions?.filter((aa)=> aa.description == "visit website").map(a => [
          `${a.description}-${a.visitor}-${new Date(a.createdAt).toDateString()}`, 
          a
      ])).values()])
        },[actions])
    const getIncome = async()=>{
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/invoice/get`,
        {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
      if(res.status == 200){
        setIncome(res.data.filter(
          (i)=>{return new Date(i.createdAt).getMonth() == new Date().getMonth()
           && new Date(i.createdAt).getFullYear() == new Date().getFullYear()})
          )
      }
    }
    const getVisitor = async()=>{
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/get-visitor`,
        {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
      if(res.status == 200){
        setVisitors(res.data.filter(
          (i)=>{return new Date(i.createdAt).getMonth() == new Date().getMonth() && new Date(i.createdAt).getFullYear() == new Date().getFullYear()})
          )
      }
    }
    const getOrders = async()=>{
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/order/get-orders`,
        {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
      if(res.status == 200){
        setOrders(res.data.filter(
          (i)=>{return new Date(i.createdAt).getMonth() == new Date().getMonth()
           && new Date(i.createdAt).getFullYear() == new Date().getFullYear()})
          )
      }
    }
     const getUsers = async()=>{
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/user/get-users`,
        {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
      if(res.status == 200){
        setUsers(res.data.filter(
          (i)=>{return new Date(i.createdAt).getMonth() == new Date().getMonth()
           && new Date(i.createdAt).getFullYear() == new Date().getFullYear()})
          )
      }
    }
    useEffect(()=>{
        getIncome()
        getOrders()
        getUsers()
        getVisitor()
        getAction();
      },[])
     
  return (
    <BarChart
    className='w-[80%]'
      series={[
        { data: [income?.filter((i)=> {return  new Date(i.createdAt).getDate() == new Date().getDate()}).length,
           income?.filter((i)=> {return  new Date(i.createdAt).getDate() == new Date().getDate() -1}).length,
             income?.filter((i)=> {return  new Date(i.createdAt).getDate() == new Date().getDate()-2}).length, 
              income?.filter((i)=> {return  new Date(i.createdAt).getDate() == new Date().getDate()-3}).length] },
        { data:  [users?.filter((i)=> {return  new Date(i.createdAt).getDate() == new Date().getDate()}).length,
           users?.filter((i)=> {return  new Date(i.createdAt).getDate() == new Date().getDate()-1}).length,
             users?.filter((i)=> {return  new Date(i.createdAt).getDate() == new Date().getDate()-2}).length, 
              users?.filter((i)=> {return new Date(i.createdAt).getMonth() == new Date().getMonth() 
                && new Date(i.createdAt).getDate() == new Date().getDate()-3}).length] },
        { data:  [orders?.filter((i)=> {return new Date(i.createdAt).getMonth() == new Date().getMonth() 
          && new Date(i.createdAt).getDate() == new Date().getDate()}).length,
           orders?.filter((i)=> {return new Date(i.createdAt).getDate() == new Date().getDate()-1}).length,
             orders?.filter((i)=> {return new Date(i.createdAt).getDate() == new Date().getDate()-2}).length, 
              orders?.filter((i)=> {return new Date(i.createdAt).getDate() == new Date().getDate()-3}).length] },
        { data:  [actionVisit?.filter((i)=> {return new Date(i.createdAt).getDate() == new Date().getDate()}).length,
           actionVisit?.filter((i)=> {return new Date(i.createdAt).getDate() == new Date().getDate()-1}).length,
             actionVisit?.filter((i)=> {return new Date(i.createdAt).getDate() == new Date().getDate()-2}).length, 
              actionVisit?.filter((i)=> {return new Date(i.createdAt).getDate() == new Date().getDate()-3}).length] },
      ]}
      height={290}
      xAxis={[{ data: ['today', 'yesterday', 'from 2 day', 'from 3 day'], scaleType: 'band' }]}
      margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
    />
  );
}