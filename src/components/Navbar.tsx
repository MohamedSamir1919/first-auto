import React, { useEffect, useState } from 'react'
import { CiDeliveryTruck } from 'react-icons/ci'
import { FaShoppingCart } from 'react-icons/fa'
import { IoIosLogOut } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
type Props = {}

function Navbar({ }: Props) {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [transparent, setTransparent] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [cart, setCart] = useState([]);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }
  const getInvoice = async () => {
    JSON.parse(localStorage.getItem("cart"))?.length > 0
      ? setCart(JSON.parse(localStorage.getItem("cart")))
      : ""

    const myInvoiceRes = await axios.post(`${import.meta.env.VITE_SERVER}/invoice/my-invoice`, {}, {
      headers:
        { Authorization: `Bearer ${token}` }
    })
    if (myInvoiceRes.status == 200) {
      setInvoices(myInvoiceRes.data.filter((i) => (i.status !== "canceled" && i.status != "completed")))
    }
  }
  useEffect(() => {
    getInvoice()
  }, [token])
  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setTransparent(false)
      }
      else {
        setTransparent(true)

      }
    })
  }, [])
  useEffect(() => {
    if (Cookies.get('token')) {
      setToken(Cookies.get("token"))

    } else {
      setToken("")

    }
  }, [Cookies.get("token")])



  const [openNav, setOpenNav] = useState(false);


  return (
    <div className={`flex flex-wrap z-[999] justify-between  
     from-gray-300 to-white fixed bg-white z-[100] top-0 left-0
     w-full shadow-lg justify-between transition-all duration-[1000ms] ${openNav ? "h-[40vw]" : 'h-[60px]'}  max-w-[100vw]
      p-2 sm:items-center items-start`}>
      {/* LEFT OF NAVBAR */}
      <div className="flex justify-between   items-center">
        <div
          onClick={() => { setOpenNav(!openNav) }}
          className="flex cursor-pointer flex-col justify-between sm:hidden  h-[15px]">
          <div className={`h-[3px] transition-all duration-[1000ms] ${openNav ? "rotate-[45deg]" : "rotate-0"} bg-black w-[15px]`}></div>
          <div className={`h-[3px]  ${openNav ? "invisible" : "visible"} bg-black w-[15px]`}></div>
          <div className={`h-[3px] transition-all duration-[1000ms] ${openNav ? "rotate-[-45deg] absolute" : "rotate-0"} bg-black w-[15px]`}></div>
        </div>
        {/* <img onClick={() => { navigate('/') }} src="/mosasha/SaSha.png" alt="Logo" className="cursor-pointer h-[40px] w-[100px] object-contain" /> */}
        <h1 onClick={() => { navigate('/') }} className="outline cursor-pointer flex  px-4">First Auto</h1>
      </div>

      <ul className={`flex  ${openNav ? "flex opacity-100" : " hidden  sm:flex"} transition-all  duration-200 sm:flex-row flex-col 
          sm:w-[10vw] w-[90vw]  justify-center items-center  `}>
        <li id="link1" onClick={() => {
          setOpenNav(false)
          navigate('/')
        }} className={`transition-all duration-[1500ms] p-2   cursor-pointer`}>Home</li>
        <li id="link2" onClick={() => {
          setOpenNav(false)
          navigate('/shopping')
        }}
          className={`transition-all duration-[1500ms]  cursor-pointer`}>Shop</li>
        <li onClick={() => {
          setOpenNav(false)
          navigate('/about')
        }} id="link3" className={`transition-all duration-[1500ms] p-2  cursor-pointer`}>About</li>
      </ul>
      <div className=" flex sm:justify-end justify-start">

        {openNav ? null :
          <ul className={`flex   items-cetner sm:items-center `}>
            {/* <li onClick={() => { i18n.language == 'en' ? changeLanguage("ar") : changeLanguage("en") }} className=" cursor-pointer relative m-2">
              {i18n.language == 'en' ? 'عربي' : 'en'}
            </li> */}
            {token ? <li onClick={() => navigate('/tracker')} className=" cursor-pointer relative m-2">
              <CiDeliveryTruck />
              {invoices?.length > 0 ? <div className="w-[15px] h-[15px]
         flex justify-center items-center 
         absolute left-[-10px] top-0 bg-[red] font-[100] rounded-[50%]">
                {invoices?.length}
              </div>
                : null
              }
            </li> : null}
            <li onClick={() => { navigate('/cart') }} className="cursor-pointer relative m-2" ><FaShoppingCart />
              {cart?.length > 0 ? <div className="w-[15px] h-[15px]
         flex justify-center items-center 
        absolute left-[-10px] top-0 bg-[red] font-[100] rounded-[50%]">
                {cart?.length}
              </div>
                : null
              }
            </li>
            {

              token ? <li
                onClick={() => {
                  Cookies.remove("token");
                  setToken("")
                  navigate('/login')
                }}
                className=" cursor-pointer text-black m-2"><IoIosLogOut /></li>
                : <li
                  className="flex items-center cursor-pointer justify-center"
                  onClick={() => {
                    Cookies.remove("token");
                    setToken("")
                    navigate('/login')
                  }}
                >
                  Login
                </li>
            }
          </ul>
        }
      </div>

    </div>
  )
}

export default Navbar