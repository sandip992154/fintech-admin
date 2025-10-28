// components/Modal.js
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("portal");

export const SuperModal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-slate-50/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="  bg-slate-100 dark:bg-darkBlue text-black dark:text-adminOffWhite rounded-lg shadow-lg relative flex flex-col "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 text-white bg-secondary cursor-pointer py-2 px-3 rounded z-10 hover:bg-red-600 transition-colors"
        >
          ✕
        </button>
        <div className="max-w-[90vw] max-h-[90vh] overflow-y-auto overflow-x-hidden hide-scrollbar p-6 pt-12">
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};
