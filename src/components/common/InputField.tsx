import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputFieldProps } from "@/lib/types/common/types";

const InputField: React.FC<InputFieldProps> = ({
  type,
  placeholder,
  customClass = "",
  disabled = false,
  value,
  register,
  errorMessage,
  showEyeIcon = true,
  accept,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
            {icon}
          </div>
        )}
        <input
          {...register}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className={`w-full h-12 px-4 rounded-lg font-circular placeholder:font-circular focus:border focus:border-white border ${customClass} ${disabled ? "!bg-[#2d291c]" : ""}`}
          disabled={disabled}
          value={value}
          onChange={() => {}}
          accept={type === "file" ? accept : undefined}
        />
        {type === "password" && showEyeIcon && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        )}
        {errorMessage && (
          <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default InputField;
