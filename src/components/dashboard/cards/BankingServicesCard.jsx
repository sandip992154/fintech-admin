import {
  FaHandHoldingUsd,
  FaQrcode,
  FaFingerprint,
  FaListAlt,
} from "react-icons/fa";
import { MdDevicesOther } from "react-icons/md";
import ServiceCard from "./ServiceCard"; // Reuse component but with custom styles

const bankingServices = [
  { label: "ePOS", icon: <MdDevicesOther /> },
  { label: "DMT", icon: <FaQrcode /> },
  { label: "AEPS", icon: <FaFingerprint /> },
  { label: "MATM", icon: <FaQrcode /> },
  { label: "CMS", icon: <FaListAlt /> },
];

export default function BankingServicesCard() {
  return <ServiceCard title="Banking Services" services={bankingServices} />;
}
