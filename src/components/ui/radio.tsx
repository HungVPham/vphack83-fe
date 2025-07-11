import React from "react";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  name: string;
  className?: string;
  disabled?: boolean;
  direction?: "horizontal" | "vertical";
}

export function RadioGroup({
  options,
  value,
  onChange,
  name,
  className = "",
  disabled = false,
  direction = "horizontal",
}: RadioGroupProps) {
  return (
    <div className={`${direction === "horizontal" ? "flex space-x-4" : "flex flex-col space-y-2"} ${className}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className={`
            flex items-center space-x-2 cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="
              h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          />
          <span className={`text-sm ${disabled ? "text-gray-400" : "text-gray-700"}`}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
} 