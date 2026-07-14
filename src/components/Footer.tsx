'use client'
import React, { useEffect } from 'react'
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa'

type Props = {}

const Footer = (props: Props) => {
  useEffect(() => {
    let span = document.getElementsByTagName('span')[0]
    span.onclick = function () {
      document.execCommand("copy");
    }
    span.addEventListener("copy", function (event) {
      event.preventDefault();
      if (event.clipboardData) {
        event.clipboardData.setData("text/plain", "01012345678");
      }
    });

  }, [])
  return (
    <div className='w-full grid grid-cols-3 pt-4 bg-gradient-to-b to-white from-gray-300 text-[14px] mt-4 pr-2 grid-flow-row gap-x-0'>
      <ul className="flex flex-col">
        <li className="">

          <h6 className='font-black '>Policies</h6>
        </li>
        <li className="mb-2  text-[14px]" >No return goods</li>
        <li className="mb-2  text-[14px]" >Shipping after 1 day</li>
        <li className="mb-2  text-[14px]" >Your information is secured</li>


      </ul>
      <ul className="flex flex-col">
        <li className="mb-2  text-[14px]" ><h6 className='font-black'>About goods</h6></li>
        <li className="mb-2  text-[14px]" >More than 100 Items</li>
        <li className="mb-2  text-[14px]" >Trusted Items</li>


      </ul>
      <ul className="flex flex-col">
        <li className=""><h6 className='font-black'>Informations</h6></li>
        <li

          className="flex items-center cursor-pointer mb-2"><FaWhatsapp className='mr-2' /> <span>
            01026457619</span></li>
        <li className="flex items-center mb-2"><FaFacebook className='mr-2' /> <a target='_blank' href='https://www.facebook.com/profile.php?id=61591675209882'>Facebook</a></li>
        <li className="flex items-center mb-2"><FaInstagram className='mr-2' /> <a target='_blank' href='https://www.instagram.com/firstautocarspareparts/?hl=en'>Instagram</a></li>


      </ul>
    </div>
  )
}

export default Footer