import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const CustomInput = ({ type = "text", placeholder, icon: Icon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative w-full">
      {/* Left Icon */}
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icon size={20} />
        </div>
      )}

      {/* Input Field */}
      <input
        type={inputType}
        placeholder={placeholder}
        className="w-full py-2 pl-10 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-1 placeholder:text-sm "
        {...props}
      />

      {/* Right Eye Toggle (only if password) */}
      {isPassword && (
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
