import React, { useState, useEffect, useRef } from 'react'
import { FaWhatsapp, FaWhatsappSquare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useTranslation } from 'react-i18next';

type Props = {}

const Intro = (props: Props) => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState();
  const { t, i18n } = useTranslation();

  const getBanners = async () => {
    const res = await axios.get(`${import.meta.env.VITE_SERVER}/setting/get-banner`)
    if (res.status == 200) {
      setBanners(res.data)
    }
  }


  useEffect(() => { getBanners() }, [])
  let [slideIndex, setSlideIndex] = useState(0)
  const callbackRef = useRef();
  const slideImages = () => {
    if (slideIndex >= 2 || slideIndex < 0) {
      setSlideIndex(0)

    }
    else {
      let num = slideIndex + 1

      setSlideIndex(num)

    }
  }

  useEffect(() => {
    callbackRef.current = () => {
      slideImages();
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      callbackRef.current();
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="w-full md:mb-[70vh] mb-[40vh] relative flex  ">

      <div className='w-full flex  relative'>
        {/* <div className="lg:static absolute left-0
             h-full w-[50%] flex flex-col
              items-center justify-center">
                    <h1
                    style={{color:'gold'}}
                    
                    className="text-[gold] md:text-[54px] text-[24px] font-black">velar Store</h1>
                    <h1 
                    style={{color:'gold'}}
                    className="text-[gold]  md:text-[42px] text-[24px] font-semibold">Men & Women</h1>
                    <div 

                     className=" px-4  text-black font-black  rounded-xl py-2 cursor-pointer bg-gradient-to-tl from-[green] to-[gold] "
                     onClick={()=>{navigate('/shopping')}}
                     >Shop</div>
            </div> */}

        <div className="flex relative    justify-center items-center">
          <div className="
              flex items-center mt-[300px]   none absolute bg-gradient- to-tl from-black to-gray-900
              ">
            <div className={`relative w-[350px] overflow-hidden h-[50vh] flex justify-center items-center z-[100] `}>

              <div className={`absolute bg-gradient-to-tr from-black to-gray-800 transition-all h-[50px] w-[350px] duration-[1s] ${slideIndex == 0 ? 'left-0' : 'left-[-350px]'} flex z-[100]`}>

                <h1 className="justify-center text-[24px] flex px-2 text-white horizontal- rl no-underline   w-[350px]">{i18n.language == "en" ? banners?.filter((i) => i.name == "first banner")[banners?.filter((i) => i.name == "first banner")?.length - 1]?.title : banners?.filter((i) => i.name == "first banner")[banners?.filter((i) => i.name == "first banner")?.length - 1]?.arabicTitle}</h1>
              </div>
              <div className={`absolute bg-gradient-to-tr from-gray-800 to-black transition-all h-[50px] w-[350px] duration-[1s] ${slideIndex == 1 ? 'left-0' : slideIndex == 0 ? 'left-[350px]' : slideIndex == 2 ? 'left-[-300px]' : ''} w-[350px] flex z-[100]`}>

                <h1 className="justify-center text-[24px] flex px-2 text-white no-underline w-[350px]">{i18n.language == "en" ? banners?.filter((i) => i.name == "second banner")[banners?.filter((i) => i.name == "second banner")?.length - 1]?.title : banners?.filter((i) => i.name == "second banner")[banners?.filter((i) => i.name == "second banner")?.length - 1]?.arabicTitle}</h1>
              </div>
              <div className={`absolute bg-gradient-to-bl from-gray-800 to-black transition-all h-[50px] w-[350px] duration-[1s] ${slideIndex == 2 ? 'left-0' : 'left-[350px]'}  w-[400px] flex z-[100]`}>

                <h1 className="justify-center text-[24px] flex px-2 text-white no-underline w-[350px]">{i18n.language == "en" ? banners?.filter((i) => i.name == "third banner")[banners?.filter((i) => i.name == "third banner")?.length - 1]?.title : banners?.filter((i) => i.name == "third banner")[banners?.filter((i) => i.name == "third banner")?.length - 1]?.arabicTitle}</h1>
              </div>
            </div>

            <a className="line-none z-[100] flex no-underlines" href="https://wa.me/201026457619">
              <div

                className=" px-4 h-[50px]   text-black font-black border-[green]  py-2 cursor-pointer bg-gradient-to-br from-[green] to-green-900 "
              //  onClick={()=>{navigate('/shopping')}}
              ><FaWhatsapp className="text-[26px]    font-black text-white" /></div>
            </a>
          </div>


          <div className="w-screen relative ">
            <div className={`absolute  flex
                ${slideIndex == 0 ? 'left-0' : slideIndex == 1 ? 'left-[-100vw]' : slideIndex == 2 ? 'left-[-200vw]' : ""}
                 flex transition-all duration-[1s]  w-[600vw]`}>
              <div className={`w-screen`}>

                <img className={
                  `md:h-[70vh] h-[40vh] w-screen `}
                  src={`${banners?.filter((i) => i.name == "first banner")[banners?.filter((i) => i.name == "first banner")?.length - 1]?.img}`} />
                {/* './imageBanner.jpg' */}
              </div>


              <div className={`w-screen`}>
                <img className={`md:h-[70vh] h-[40vh] w-screen`} src='./intro.jpg'
                  src={`${banners?.filter((i) => i.name == "second banner")[banners?.filter((i) => i.name == "second banner")?.length - 1]?.img}`} />

              </div>
              <div className={`w-screen`}>

                <img className={`md:h-[70vh] h-[40vh] w-screen`}
                  src={`${banners?.filter((i) => i.name == "third banner")[banners?.filter((i) => i.name == "third banner")?.length - 1]?.img}`} />

              </div>

            </div>

          </div>
        </div>
      </div>

    </div>
  )
}

export default Intro