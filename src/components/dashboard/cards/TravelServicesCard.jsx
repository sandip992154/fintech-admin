import { FaTrain, FaPlaneDeparture, FaBus, FaHotel } from "react-icons/fa";
import ServiceCard from "./ServiceCard";

const travelServices = [
  { label: "IRCTC", icon: <FaTrain /> },
  { label: "Flight", icon: <FaPlaneDeparture /> },
  { label: "Bus", icon: <FaBus /> },
  { label: "Hotel booking", icon: <FaHotel /> },
];

export default function TravelServicesCard() {
  return <ServiceCard title="Travel Services" services={travelServices} />;
}
