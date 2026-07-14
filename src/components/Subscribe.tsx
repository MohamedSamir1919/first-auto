import React,{useState,useEffect} from 'react'
import axios from 'axios'
type Props = {}

const Subscribe = (props: Props) => {
  const [email,setEamil] = useState();
  const [message, setMessage] = useState();
const subscribeEmail = async()=>{
  if(email.length > 0)
 { const res = await axios.post(`${import.meta.env.VITE_SERVER}/visitor/subscribe`,{email:email},{headers:{vToken:`Bearer ${localStorage.getItem("vt")}`}})
  if(res.status == 200){
    setMessage("Welcome")
    setTimeout(() => {
    setMessage()
      
    }, 2000);
  }}
}

  return (
    <div
    className="w-[300px] rounded-lg bg-gray-100"
    >
        <div className="p-2 flex items-center relative">
            <input className="rounded-lg overflow-auto p-2 bg-gray-200 w-full" onChange={(e)=>{setEamil(e.target.value)}} placeholder="example@email.com"/>
            <div className="p-2 h-full right-0 flex  items-center">
                <div onClick={()=>{subscribeEmail()}} className="rounded-lg cursor-pointer transition-all duration-[2s] bg-gradient-to-tr p-2 from-black text-white to-gray-700">Subscribe</div>
                <div className={``}>{message}</div>
            </div>
        </div>
    </div>
  )
}

export default Subscribe