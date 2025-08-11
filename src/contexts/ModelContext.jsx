// context/ModalContext.js
import { createContext, useState } from "react";

// Create context
export const ModalContext = createContext();

// Create provider component
export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <ModalContext.Provider value={{ showModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
