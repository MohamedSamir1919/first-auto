import axios from 'axios';
import React, { useEffect, useState } from 'react';

// استيراد مكونات Swiper الخاصة بالـ React
import { Swiper, SwiperSlide } from 'swiper/react';
// استيراد موديولات Swiper
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// استيراد ستايلات Swiper الأساسية
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

const Collection = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCollections = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER}/collection`);
      if (res.status === 200) {
        // فلترة الكوليكشنز النشطة فقط (إذا كان لديك حقل active)
        const activeCollections = res.data.filter(col => col.active !== false);
        setCollections(activeCollections);
      } else {
        console.log(res.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (collections.length === 0) {
    return null;
  }

  // تحديد ما إذا كان عدد العناصر قليل لجعلهم في المنتصف بشكل مثالي
  const isFewSlides = collections.length < 4;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      {/* عنوان القسم بتصميم عصري */}
      <div className="text-center mb-12 relative">

        <h2 className="text-3xl font-black text-gray-900 tracking-tight sm:text-5xl mt-3">
          Our Collections
        </h2>
        <div className="w-12 h-1 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* حاوية السلايدر */}
      <div className="relative px-2">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={28}
          // ✨ التمركز التلقائي في وسط الصفحة
          centeredSlides={isFewSlides}
          centeredSlidesBounds={true}
          // لو العناصر قليلة، بنثبت الـ Loop ليكون false عشان ميعملش تكرار وهمي للكروت
          loop={!isFewSlides}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // يقف مؤقتاً لو العميل حط الماوس عليه
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          breakpoints={{
            320: {
              slidesPerView: 1.2, // يظهر جزء من الكارت التالي ليشجع المستخدم على السحب
              centeredSlides: true,
            },
            480: {
              slidesPerView: 2,
              centeredSlides: isFewSlides || collections.length < 2,
            },
            768: {
              slidesPerView: 3,
              centeredSlides: isFewSlides || collections.length < 3,
            },
            1024: {
              slidesPerView: isFewSlides ? collections.length : 4, // ديناميكي حسب العدد المتوفر
              centeredSlides: isFewSlides,
            },
          }}
          // كلاسات لتجميل شكل الأسهم القياسية للـ Swiper ومحاذاتها
          className="pb-16 !px-3 swiper-custom-container"
        >
          {collections.map((col) => (
            <SwiperSlide key={col._id} className="py-2">
              {/* الكارت بالكامل مغلف بـ Link لسهولة الضغط وتجربة مستخدم ممتازة */}
              <Link
                to={`/shopping?cat=${col.name}`}
                className="group block cursor-pointer"
              >
                <div className="flex flex-col items-center">
                  {/* حاوية الصورة مع ظل ناعم وحواف دائرية عصرية */}
                  <div className="w-full aspect-[4/5] overflow-hidden rounded-3xl bg-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 relative transition-all duration-500 group-hover:shadow-[0_15px_35px_rgba(79,70,229,0.15)] group-hover:-translate-y-1">
                    <img
                      src={col.img || 'https://via.placeholder.com/400x500'}
                      alt={col.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* تظليل متدرج (Gradient Overlay) يظهر من الأسفل */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>

                  {/* اسم الكوليكشن */}
                  <div className="mt-5 text-center">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300 tracking-wide">
                      {col.name}
                    </h3>
                    <span className="inline-block text-xs font-semibold text-indigo-500 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Shop Now &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ✨ تنسيق بسيط لأسهم الـ Swiper لتتماشى مع ألوان البراند */}
      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: #4f46e5 !important;
          background: rgba(255, 255, 255, 0.9);
          width: 44px !important;
          height: 44px !important;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .swiper-button-next:hover, .swiper-button-prev:hover {
          background: #4f46e5;
          color: #ffffff !important;
          transform: scale(1.05);
        }
        .swiper-button-next::after, .swiper-button-prev::after {
          font-size: 18px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background: #4f46e5 !important;
        }
        @media (max-width: 640px) {
          .swiper-button-next, .swiper-button-prev {
            display: none !important; /* إخفاء الأسهم على الموبايل والاعتماد على السحب باليد */
          }
        }
      `}</style>
    </div>
  );
};

export default Collection;