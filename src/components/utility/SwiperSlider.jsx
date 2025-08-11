import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import required modules
import { Pagination, Navigation, Autoplay } from "swiper/modules";

export default function SwiperSlider({ SliderImages }) {
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Pagination, Navigation, Autoplay]}
      className="mySwiper"
    >
      {SliderImages.map((img, index) => (
        <SwiperSlide key={index}>
          <div className="w-full h-full relative overflow-hidden">
            <img
              src={img}
              alt={`slide-${index}`}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
