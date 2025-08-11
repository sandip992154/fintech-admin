// service icons
import { RiAdminFill } from "react-icons/ri";
import { BsBank, BsShieldPlus, BsPersonBadge } from "react-icons/bs";
import { FaPlaneDeparture, FaUser } from "react-icons/fa";
import {
  BiSolidUserRectangle,
  HiShieldCheck,
  PiPottedPlantFill,
  FaMoneyCheck,
} from "../assets/react-icons";

import { CustomDatePicker } from "../components/utility/CustomDatePicker";
import WalletBalanceCard from "../components/dashboard/WalletBancedCard";
import { ServiceCard } from "../components/dashboard/ServiceCard";
import { useState } from "react";
import { SuperModal } from "../components/utility/SuperModel";
import { Link } from "react-router";
import RechargeBillPaymentCard from "../components/dashboard/cards/RechargeBillPaymentCard";
import BankingServicesCard from "../components/dashboard/cards/BankingServicesCard";
import InsuranceLoanCard from "../components/dashboard/cards/InsuranceLoanCard";
import TravelServicesCard from "../components/dashboard/cards/TravelServicesCard";

const serviceCards = [
  {
    icon: <BiSolidUserRectangle size={24} />,
    bgIcon: "bg-[#7fd3ec]",
    label: "Recharge & Bill Payment",
    name: "recharge",
  },
  {
    icon: <HiShieldCheck size={24} />,
    bgIcon: "bg-[#978ee1]",
    label: "Banking Services",
    bgColor: "bg-[#00B89438]",
    name: "banking",
  },
  {
    icon: <PiPottedPlantFill size={24} />,
    bgIcon: "bg-[#f4bdcf]",
    label: "Insurance",
    bgColor: "bg-[#FDE7EF]",
    name: "insurance",
  },
  {
    icon: <FaMoneyCheck size={24} />,
    bgIcon: "bg-[#978ee1]",
    label: "Loan Services",
    bgColor: "bg-[#6C5CE738]",
    name: "loan",
  },
  {
    icon: <FaPlaneDeparture size={24} />,
    bgIcon: "bg-[#4db6ac]",
    label: "Travel Services",
    bgColor: "bg-[#e0f2f1]",
    name: "travel",
  },
];

export default function Dashboard() {
  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [isCardsVisible, setIsCardsVisible] = useState({
    recharge: false,
    banking: false,
    insurance: false,
    loan: false,
    travel: false,
  });

  const handleCardClick = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const toggleCardVisibility = (card) => {
    setIsCardsVisible((prev) => ({ ...prev, [card]: !prev[card] }));
  };
  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 dark:text-white  bg-secondaryOne dark:bg-darkBlue  rounded-t-2xl xl:rounded-b-2xl 2xl:mx-auto text-gray-800 overflow-hidden">
      <div className="sticky top-0 z-10  py-4">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <CustomDatePicker />
        </div>
      </div>
      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[calc(100vh-120px)] px-4 pb-6  scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div className="">
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3">
              <WalletBalanceCard />
            </div>
            <div className="col-span-1">
              <ServiceCard
                {...serviceCards[0]}
                onClick={() => toggleCardVisibility("recharge")}
              />
            </div>
          </div>
          <div className="py-4">
            <div className="grid grid-cols-4 gap-2 ">
              <ServiceCard
                {...serviceCards[1]}
                onClick={() => toggleCardVisibility("banking")}
              />
              <ServiceCard
                {...serviceCards[2]}
                onClick={() => toggleCardVisibility("insurance")}
              />
              <ServiceCard
                {...serviceCards[3]}
                onClick={() => toggleCardVisibility("loan")}
              />
              <ServiceCard
                {...serviceCards[4]}
                onClick={() => toggleCardVisibility("travel")}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {/* User Counts */}
          <div className="bg-white dark:bg-cardOffWhite dark:text-adminOffWhite rounded-md shadow p-4 space-y-2 text-sm">
            <p className="font-semibold">User Counts</p>

            <Link to="members/whitelabel">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BsBank className="text-purple-500" /> White Label
                </div>
                <span>2</span>
              </div>
            </Link>
            <Link to="members/mds">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BsShieldPlus className="text-pink-500" /> Master Distributer
                </div>
                <span>1</span>
              </div>
            </Link>
            <Link to="members/ds">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BsPersonBadge className="text-cyan-500" /> Distributer
                </div>
                <span>1</span>
              </div>
            </Link>
            <Link to="members/retail">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaUser className="text-amber-500" /> Retailer
                </div>
                <span>1</span>
              </div>
            </Link>
            <Link to="members/customer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaUser className="text-cyan-500" /> Customer
                </div>
                <span>1</span>
              </div>
            </Link>
          </div>
          {/* Support Box */}
          <div className="bg-white dark:bg-cardOffWhite dark:text-adminOffWhite rounded-md shadow p-4 text-center text-sm">
            <div className="flex justify-center mb-2">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="support"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <p className="mb-1">Timing: 10am to 7pm</p>
            <p>9059207545</p>
            <p className="font-semibold">support@phonesepay.in</p>
          </div>
        </div>
      </div>
      {/* {showModal && modalData && (
        <SuperModal onClose={() => setShowModal(false)}>
          <div className="mb-4 text-lg font-semibold text-center">
            {modalData.label} Transactions
          </div>
          <div className="grid grid-cols-3 gap-6 justify-between">
            {modalData.transactions.map((tx, idx) => (
              <SummaryCard
                key={idx}
                label={tx.label}
                value={tx.value}
                color={tx.color}
              />
            ))}
          </div>
        </SuperModal>
      )} */}

      {isCardsVisible.recharge && (
        <SuperModal
          onClose={() =>
            setIsCardsVisible((prev) => ({ ...prev, recharge: false }))
          }
        >
          <RechargeBillPaymentCard />
        </SuperModal>
      )}
      {isCardsVisible.banking && (
        <SuperModal
          onClose={() =>
            setIsCardsVisible((prev) => ({ ...prev, banking: false }))
          }
        >
          <BankingServicesCard />
        </SuperModal>
      )}
      {isCardsVisible.insurance && (
        <SuperModal
          onClose={() =>
            setIsCardsVisible((prev) => ({ ...prev, insurance: false }))
          }
        >
          <InsuranceLoanCard />
        </SuperModal>
      )}
      {isCardsVisible.travel && (
        <SuperModal
          onClose={() =>
            setIsCardsVisible((prev) => ({ ...prev, travel: false }))
          }
        >
          <TravelServicesCard />
        </SuperModal>
      )}
    </div>
  );
  P;
}
