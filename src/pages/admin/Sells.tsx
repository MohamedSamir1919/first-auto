import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
const Sells = () => {
    const [income,setIncome] = useState();
    const [orders,setOrders] = useState();
      const [visitors,setVisitors] = useState();
      const [users,setUsers] = useState();
      const [actions,setActions] = useState();
      const [actionVisit, setActionVisit] = useState([]);
      const [itemIndex, setItemIndex] = useState();
        const [products, setProducts] = useState([]);
      const getProducts = async () => {
          const res = await axios.get(`${import.meta.env.VITE_SERVER}/products`);
          if (res.status == 200 ) {
            setProducts(res.data);
            
          } else {
      
          }
        };
      const changeStatus= async (id,status,paid : 0)=>{
         const res = await axios.put(`${import.meta.env.VITE_SERVER}/invoice`,
            {id:id,status:status,paid},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
          if(res.status == 200){
            getIncome();
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
                    
setActionVisit([...new Map(actions?.filter((aa)=> aa.description == "visit website").map(a => [
        `${a.description}-${a.visitor}-${new Date(a.createdAt).toDateString()}`, 
        a
    ])).values()])
      },[actions])
      
   const getVisitor = async()=>{
        const res = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/get-visitor`,
          {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
        if(res.status == 200){
          setVisitors(res.data.filter(
            (i)=>{return new Date(i.createdAt).getMonth() == new Date().getMonth() && new Date(i.createdAt).getFullYear() == new Date().getFullYear()})
            )
        }
      }
      const getAction = async()=>{
        const res = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/actions`,
          {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
        if(res.status == 200){
          setActions(res.data.filter(
            (i)=>{return new Date(i.createdAt).getFullYear() == new Date().getFullYear()})
            )
        }
      }
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
    useEffect(()=>{getIncome()
getOrders()
getVisitor()
getUsers()
getAction()
getUsers();
getProducts();
    },[])
    return (
    <div className="">
      <main className="flex-1 ml-[500px] md:ml-[100px] p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Sales Overview</h1>
                {/* <div className="flex space-x-4">
                    <button className="bg-white px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">Download Report</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Add Product</button>
                </div> */}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold">{income?.reduce((total,curr)=>{
                      return total + curr.paid
                    },0)} EGP</h3>
                    <span className="text-green-500 text-sm font-medium"><i className="fas fa-arrow-up"></i> {income?.reduce((total,curr)=>{
                      return total + curr.paid
                    },0)/income?.filter((i)=> new Date().getMonth() == 0 ? new Date(i.createdAt).getMonth() == 11 
                    && new Date(i.createdAt).getFullYear() == new Date().getFullYear() -1 
                  : new Date(i.createdAt).getMonth() == new Date().getMonth() -1 && new Date(i.createdAt).getFullYear() == new Date().getFullYear()
                ).reduce((total,curr)=>{
                      return total + curr.paid
                    },0) == Infinity ? 100 :
                    income?.reduce((total,curr)=>{
                      return total + curr.paid
                    },0)/income?.filter((i)=> new Date().getMonth() == 0 ? new Date(i.createdAt).getMonth() == 11 
                    && new Date(i.createdAt).getFullYear() == new Date().getFullYear() -1 
                  : new Date(i.createdAt).getMonth() == new Date().getMonth() -1 && new Date(i.createdAt).getFullYear() == new Date().getFullYear()
                ).reduce((total,curr)=>{
                      return total + curr.paid
                    },0)|0
                    } %</span>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <h3 className="text-2xl font-bold">{orders?.length}</h3>
                    <span className="text-green-500 text-sm font-medium"><i className="fas fa-arrow-up">
                      </i> {orders?.length / orders?.filter((i)=> new Date().getMonth() == 0 ? new Date(i.createdAt).getMonth() == 11 
                    && new Date(i.createdAt).getFullYear() == new Date().getFullYear() -1 
                  : new Date(i.createdAt).getMonth() == new Date().getMonth() -1 && new Date(i.createdAt).getFullYear() == new Date().getFullYear()
                )?.length == Infinity ? 100 
                : orders?.length / orders?.filter((i)=> new Date().getMonth() == 0 ? new Date(i.createdAt).getMonth() == 11 
                    && new Date(i.createdAt).getFullYear() == new Date().getFullYear() -1 
                  : new Date(i.createdAt).getMonth() == new Date().getMonth() -1 && new Date(i.createdAt).getFullYear() == new Date().getFullYear()
                )?.length|0
                }%</span>
                </div>
                {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Conversion Rate</p>
                    <h3 className="text-2xl font-bold">3.42%</h3>
                    <span className="text-red-500 text-sm font-medium"><i className="fas fa-arrow-down"></i> 1.1%</span>
                </div> */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Active Customers</p>
                    <h3 className="text-2xl font-bold">
                    {
                    actionVisit?.filter(a=>{return new Date(a.createdAt).getMonth() == new Date().getMonth()}).length
                    }
                    </h3>
                    <span className="text-green-500 text-sm font-medium"><i className="fas fa-arrow-up"></i> 
                    {
                  actionVisit?.filter(a=>{return new Date(a.createdAt).getMonth() == new Date().getMonth()}).length
                    /actionVisit?.filter(a=>{return new Date().getMonth() > 0 
                    ?  new Date(a.createdAt).getMonth() == new Date().getMonth()-1 : new Date(a.createdAt).getMonth() == 11}).length
                    == Infinity ? 100 
                    : actionVisit?.filter(a=>{return new Date(a.createdAt).getMonth() == new Date().getMonth()}).length
                    /actionVisit?.filter(a=>{return new Date().getMonth() > 0 
                    ?  new Date(a.createdAt).getMonth() == new Date().getMonth()-1 : new Date(a.createdAt).getMonth() == 11}).length
                    
                  }%
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">phone</th>
                                <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                <th className="px-6 py-4 font-semibold text-right">status</th>
                                <th className="px-6 py-4 font-semibold text-right">items</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {
                            income?.sort((a, b) => {
  return new Date(b.createdAt) - new Date(a.createdAt);
}).map((i,index)=>{

                             return ( <tr>
                                <td className="px-6 py-4 text-sm">#Inventory-{i._id.slice(-6)}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{users && users?.filter((u)=>{return u._id == i.user})[0]?.firstName} {users?.filter((u)=> {return u._id == i.user})[0]?.lastName}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{new Date(i.createdAt).toLocaleDateString('en-US', {
  month: 'short', // "Jan"
  day: '2-digit', // "22"
  year: 'numeric' // "2026"
})}</td>
                                <td className="px-6 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{i.status}</span></td>
                                <td className="px-6 py-4 text-right font-medium">{users?.filter((u)=>{return u._id == i.user})[0]?.telephone}</td>
                                <td className="px-6 py-4 text-right font-medium">{i.price}</td>
                                <td className="px-6 py-4 text-right font-medium">
                                  <div className={` rounded-xl p-2 ${i.status == "order placed" ? "bg-green-500": i.status == "on transit" ? "bg-red-400" : "bg-black text-white"}`}>

                                  <button onClick={()=>{
                                    i.status == 'order placed' ? changeStatus(i._id,"on transit") : i.status == "on transit" ? changeStatus(i._id,"completed",i.price):true
                                  }} className="" disabled={i.status == "completed" ? true : false}>
                                    {i.status == "order placed" ? "transit": i.status == "on transit" ? "Complete" : "Done"}
                                    </button>
                                  </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium relative">
                                  <div className="bg-green-400 rounded-xl p-2">

                                  <button className="" onClick={()=>{itemIndex != index ? setItemIndex(index) : setItemIndex(-1)}}>
                                    items
                                    </button>
                                  </div>
                                    {
                                  <div className={`${itemIndex == index ? "flex flex-col": "hidden"} absolute
                                  top-[100%]  
                     left-[-200%] w-[230px] h-full  z-[1000] bg-white
                                  `}>
                                      {orders?.filter((o)=> {return o.invoice == i._id}).map((o)=>{
                                        return (
                                        <div>
                                          <div>{products?.filter((p)=>{return p.slug == o.slug})[0]?.title}</div>
                                        <div>
                                        {products?.filter((p)=>{return p.slug == o.slug})[0]?.price}EGP
                                        </div>
                                        
                                        <div>
                                        {o?.details?.map((a)=>{
                                          {
                                            return Object.entries(a).map(([key, value])=>{

                                              return(
                                                <div>{key} : {value}</div>
                                              )
                                            })
                                          }
                                        })}
                                        </div>
                                          ---------------

                                        </div>
                                        )
                                    
                                     })}

                                  </div>
                                  
                                  }
                                    </td>
                                    
                            </tr>)
                            })
                          }
                           
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
  )
}

export default Sells
