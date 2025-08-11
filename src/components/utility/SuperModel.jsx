// components/Modal.js
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("portal");

export const SuperModal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-slate-50/70  flex items-center justify-center z-50  "
      onClick={onClose}
    >
      <div
        className="max-w-[80vw]  bg-slate-100 dark:bg-darkBlue text-black dark:text-adminOffWhite p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 text-white bg-secondary cursor-pointer py-2 px-3 rounded "
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
