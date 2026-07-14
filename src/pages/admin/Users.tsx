import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

import { useForm, SubmitHandler } from "react-hook-form"
import { FaEye, FaEyeSlash } from 'react-icons/fa';
type Inputs = {
  email: string;
  firstName: string;
  lastName: string;
password:string;
phoneNum: string;
telephone:string;
address:string;
isAdmin:boolean;
}
const Users = () => {
    const [selectedRows, setSelectedRows] = useState()
    const [users, setUsers] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
     const [visitors,setVisitors] = useState();
      const [actions,setActions] = useState();
      const [actionVisit, setActionVisit] = useState([]);
       const [showPassword,setShowPassword] = useState(false)
      const [message,setMessage] = useState("");

      const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm<Inputs>()
      const onSubmit =async (data) => {
    const res = await axios.post(`${import.meta.env.VITE_SERVER}/auth`,data)
     if(res.status == 200){
          getUsers();
                setIsModalOpen(false);

        }
        else if(res.status == 302){
          setMessage("You allready joined")
        }
        else{
          console.log(res)
        }
        
      }
      useEffect(()=>{
                    
setActionVisit([...new Map(actions?.filter((aa)=> aa.description == "open website" ).map(a => [
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
  
      const getUsers = async()=>{
    const res = await axios.post(`${import.meta.env.VITE_SERVER}/user/get-users`,
      {},{headers:{Authorization:`Bearer ${Cookies.get('token')}`}})
    if(res.status == 200){
      setUsers(res.data)
      console.log(res.data)
    }
  }
  useEffect(()=>{
    getUsers();
    getAction();
    getVisitor();
  },[])
 return (
  <div className="p-6 bg-gray-50 ml-[100px] md:ml-0 min-h-screen">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Users Dashboard</h1>
      <div className="space-x-2">
        {/* زر فتح المودال */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add New User
        </button>
        {selectedRows?.length > 0 && (
          <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition">
            Delete Selected ({selectedRows?.length})
          </button>
        )}
      </div>
    </div>
      
    

    {/* Table Container */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="p-4 w-10">
              <input 
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                // onChange={handleSelectAll}
                // checked={users.length > 0 && selectedRows.length === users.length}
              />
            </th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">User Info</th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Status</th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase">Admin</th>
            <th className="p-4 text-sm font-semibold text-gray-600 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users?.map((user) => (
            <tr 
              key={user._id} 
              className={`hover:bg-gray-50 transition ${selectedRows?.includes(user._id) ? 'bg-blue-50/50' : ''}`}
            >
              <td className="p-4">
                <input 
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={selectedRows?.includes(user._id)}
                //   onChange={() => handleSelectRow(user._id)}
                />
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    {user.firstName } 
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.firstName } {user.lastName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${actionVisit?.some((a)=> {return a.visitor == user.visitor}) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {actionVisit?.some((a)=> {return a.visitor == user.visitor}) ? 'Active' : 'Offline'}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-600">{user.isAdmin }</td>
              <td className="p-4 text-right">
                <button className="text-gray-400 hover:text-blue-600 px-2 transition">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

   {/* --- Add User Modal --- */}
    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop (الخلفية المظلمة) */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        ></div>

        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-2xl z-10 w-full max-w-md p-6 transform transition-all">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add New User</h2>
          
           <div className="w-full flex min-h-[80vh] justify-center items-center">
            <form onSubmit={handleSubmit(onSubmit)} className=" rounded-sm shadow-2xl max-w-[300px] flex flex-col items-center p-4">
              <input className="bg-gray-200 m-2" placeholder="email@example.com" {...register("email",{pattern:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/})}/>
              {errors.email && <p role="alert">{errors.email.message}</p>}
              <input className="bg-gray-200 m-2" placeholder="First name" {...register("firstName")}/>
              {errors.firstName?.type === "required" && (
        <p role="alert">First name is required</p>
      )}


              
              <input className="bg-gray-200 m-2" placeholder="Last name" {...register("lastName")}/>
              {errors.lastName && <p role="alert">{errors.lastName.message}</p>}
              <div className="flex justify-center items-center">
              Admin: <input className="bg-gray-200 m-2" type="checkbox" {...register("idAdmin")}/>
              </div>
              <input className="bg-gray-200 m-2" placeholder="phone" {...register("telephone",{pattern:/^01[0-2]\d{1,8}$/})}/>
              {errors.telephone && <p role="alert">{errors.telephone.message}</p>}

              <textarea className="bg-gray-200 m-2" placeholder="Address" {...register("address")}/>
              {errors.address && <p role="alert">{errors.address.message}</p>}

              <div className="relative">
              <input className="bg-gray-200 m-2" type={showPassword ? "text":'password'} placeholder="password" {...register("password")}/>
              {showPassword ?
              <FaEyeSlash onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-3" />
              :<FaEye onClick={()=>setShowPassword(!showPassword)} className="absolute right-4 top-3" />
              }</div>
              <h1 className="text-[red]">
              {message}
              </h1>
              <div className="">You allready joined, <span onClick={()=>navigate("/login")} className="text-blue-500 cursor-pointer">login</span></div>
              <div  className="w-full cursor-pointer flex justify-around items-center  from-black to-gray-700 text-white rounded-lg">
                 <div 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 h-8 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              
              Cancel
            </div>
            
            <button 
            type="submit"
              className="px-4 py-2 text-sm h-8 flex items-center justify-center font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md"
             
            >
              Add User
            </button>

          </div>
            </form>

        </div>
  
          {/* Modal Actions */}
          
        </div>
      </div>
    )}
  </div>
);
}

export default Users
