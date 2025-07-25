"use client";

import { DropdownProps } from "@/lib/types/common/types";
import React, { useState, useRef, useEffect } from "react";

function Dropdown<T extends object, K extends keyof T, V extends keyof T>({
  options,
  value,
  onChange,
  labelKey,
  valueKey,
  placeholder = "Select...",
  customClass = "",
  disabled = false,
}: DropdownProps<T, K, V>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left w-full ${customClass}`} ref={dropdownRef}>
      <button
        type="button"
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value ? String(value[labelKey]) : placeholder}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414-1.414l5-5A1 1 0 0110 3z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          role="listbox"
          tabIndex={-1}
        >
          {options.map((option) => (
            <li
              key={String(option[valueKey])}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-orange-100 ${value && option[valueKey] === value[valueKey] ? "font-semibold text-orange-600" : "text-gray-900"}`}
              role="option"
              aria-selected={!!(value && option[valueKey] === value[valueKey])}
              onClick={() => handleSelect(option)}
            >
              {String(option[labelKey])}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
