import { curve } from "../../assets/assets";

const WalletBalanceCard = () => {
  return (
    <div className="relative bg-gradient-to-r from-[#1C72B9] to-[#4392C0] text-white rounded-md overflow-hidden shadow-md p-4 h-32 w-full flex flex-col justify-center">
      {/* Text content */}
      <div className="z-10">
        <div className="text-2xl font-bold">12800000</div>
        <div className="text-sm">Maha wallet Balance</div>
      </div>

      {/* SVG Curve Overlay */}
      <svg
        className="absolute top-0 right-0 h-full w-auto z-0"
        viewBox="0 0 400 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id="strong-shadow"
            x="-30%"
            y="-30%"
            width="250%"
            height="250%"
          >
            <feDropShadow
              dx="40"
              dy="0"
              stdDeviation="20"
              floodColor="#F8CB72"
              floodOpacity="1"
            />
          </filter>
        </defs>
        <path
          d="M120 200 C100 90 350 100 350 -10"
          stroke="#F8CB72"
          strokeWidth="6"
          fill="none"
          filter="url(#strong-shadow)"
        />
      </svg>

      {/* <div className="absolute -top-10 right-0  z-0">
        <img src={curve} alt="curve-img" className="" />
      </div> */}
    </div>
  );
};

export default WalletBalanceCard;
