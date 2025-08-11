import {
  FaMobileAlt,
  FaTv,
  FaBolt,
  FaShieldAlt,
  FaTint,
  FaGasPump,
  FaCreditCard,
  FaRegPlayCircle,
} from "react-icons/fa";
import { MdDirectionsCarFilled } from "react-icons/md";
import ServiceCard from "./ServiceCard";

const services = [
  { label: "Mobile", icon: <FaMobileAlt /> },
  { label: "DTH", icon: <FaTv /> },
  { label: "Electricity", icon: <FaBolt /> },
  { label: "Life", icon: <FaShieldAlt /> },
  { label: "Water", icon: <FaTint /> },
  { label: "Pipe Gas", icon: <FaGasPump /> },
  { label: "Credit", icon: <FaCreditCard /> },
  { label: "FastTag", icon: <MdDirectionsCarFilled /> },
  { label: "OTT", icon: <FaRegPlayCircle /> },
];

export default function RechargeBillPaymentCard() {
  return <ServiceCard title="Recharge & Bill Payments" services={services} />;
}
