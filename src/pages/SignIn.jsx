import CustomInput from "../components/utility/CustomInput";
import { MdEmail, MdLock } from "react-icons/md";
import SwiperSlider from "../components/utility/SwiperSlider";

export const SignIN = () => {
  const SliderImages = [
    "https://static.vecteezy.com/system/resources/previews/003/001/886/non_2x/fintech-financial-technology-online-banking-and-crowdfunding-vector.jpg",
    "https://www.currencytransfer.com/wp-content/uploads/2024/09/blog-post-image-fintech1.jpg",
    "https://www.chiratae.com/wp-content/uploads/2022/12/Indian-fintech-market-expected-to-reach-USD-150-bn-in-valuation-by-2025-MoS-Finance.jpg-1024x576.webp",
  ];
  return (
    <section className="flex h-[100vh]">
      <div className="w-1/2 hidden md:block">
        <SwiperSlider SliderImages={SliderImages} />
      </div>
      <div className="w-full  md:w-1/2">
        <form action="" className="p-8">
          <div className="w-full max-w-sm mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-semibold mb-8">
              Sign in to your Account
            </h1>
            <CustomInput
              type="text"
              placeholder="Enter account username or email for login"
              icon={MdEmail}
            />
            <CustomInput
              type="password"
              placeholder="Enter account login password"
              icon={MdLock}
            />
            <div className="flex items-center justify-between gap-4 text-orange-400 text-sm font-semibold">
              <span className="cursor-pointer">Forgot Username?</span>
              <span className="cursor-pointer">Forgot Password?</span>
            </div>

            {/* button */}
            <button className="w-full py-2 pl-10 text-white font-bold pr-10 rounded-md  bg-orange-400 cursor-pointer">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
