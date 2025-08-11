import React, { useState, useEffect, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { InputFieldProps } from "@/lib/types/common/types";

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
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
  onChange,
  name,
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (onChange) {
      onChange(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue !== inputValue) {
      setInputValue(newValue);
      
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue,
          name: e.target.name,
        },
        type: 'change',
      } as React.ChangeEvent<HTMLInputElement>;
      
      if (onChange) {
        onChange(syntheticEvent);
      }
    }
  };

  const inputProps = register ? {
    ...register,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (register.onChange) {
        register.onChange(e);
      }
      handleChange(e);
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      if (register.onBlur) {
        register.onBlur(e);
      }
      handleBlur(e);
    },
  } : {
    value: inputValue,
    onChange: handleChange,
    onBlur: handleBlur,
    name,
  };

  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white">
            {icon}
          </div>
        )}
        <input
          ref={register ? register.ref : ref}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className={`w-full h-12 px-4 rounded-lg font-circular placeholder:font-circular focus:border focus:border-white border ${customClass} ${disabled ? "!bg-[#2d291c]" : ""}`}
          disabled={disabled}
          accept={type === "file" ? accept : undefined}
          {...inputProps}
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
});

InputField.displayName = "InputField";

export default InputField;
