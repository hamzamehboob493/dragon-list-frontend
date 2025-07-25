import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  customClass?: string;
  loading?: boolean;
}

export interface DataTableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  customClass?: string;
}

export interface DropdownProps<T extends object, K extends keyof T, V extends keyof T> {
  options: T[];
  value?: T | null;
  onChange: (value: T) => void;
  labelKey: K;
  valueKey: V;
  placeholder?: string;
  customClass?: string;
  disabled?: boolean;
}

export interface FormsProps {
  children: ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  customClass?: string;
}

export interface InputFieldProps {
  name?: string;
  register?: UseFormRegisterReturn;
  label?: string;
  type?: string;
  value?: string | number | undefined;
  placeholder?: string;
  customClass?: string;
  labelClass?: string;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setHide?: (value: boolean) => void;
  hide?: boolean;
  showEyeIcon?: boolean;
  disabled?: boolean;
  accept?: string;
  icon?: ReactNode;
}
export interface LoaderProps {
  size?: number;
  color?: string;
  customClass?: string;
}

