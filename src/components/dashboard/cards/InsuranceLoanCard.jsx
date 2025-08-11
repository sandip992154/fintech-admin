import {
  FaMotorcycle,
  FaCar,
  FaPlusSquare,
  FaBitcoin,
  FaWallet,
  FaCheckCircle,
} from "react-icons/fa";
import { IoLogoBitcoin } from "react-icons/io5";
import { RiShieldCheckFill } from "react-icons/ri";
import ServiceCard from "./ServiceCard"; // same reusable card with darkMode

const insuranceLoanServices = [
  { label: "Bike Insurance", icon: <FaMotorcycle /> },
  { label: "Car Insurance", icon: <FaCar /> },
  { label: "Health Insurance", icon: <FaPlusSquare /> },
  { label: "Gold Loan", icon: <IoLogoBitcoin /> },
  { label: "Loan Repayment", icon: <FaWallet /> },
  { label: "Term Insurance", icon: <RiShieldCheckFill /> },
];

export default function InsuranceLoanCard() {
  return (
    <ServiceCard
      title="Insurance & Loan Payment"
      services={insuranceLoanServices}
      darkMode={true}
      showSubLabel={true}
    />
  );
}
