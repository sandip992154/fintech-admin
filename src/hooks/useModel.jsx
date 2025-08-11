import { useContext } from "react";
import { ModalContext } from "../contexts/ModelContext";

// Custom hook for easy usage
export const useModal = () => useContext(ModalContext);
