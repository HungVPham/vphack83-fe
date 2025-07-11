import React, { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = "",
  id,
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  // Update input value when prop value changes (from +/- buttons)
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);

    // Only validate and call onChange if the input is a valid number
    if (rawValue !== "" && !isNaN(Number(rawValue))) {
      const numValue = parseInt(rawValue);
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(min, Math.min(max, numValue));
        onChange(clampedValue);
      }
    }
  };

  const handleInputBlur = () => {
    // On blur, ensure we have a valid value
    if (inputValue === "" || isNaN(Number(inputValue))) {
      setInputValue(value.toString());
    } else {
      const numValue = parseInt(inputValue);
      if (!isNaN(numValue)) {
        const clampedValue = Math.max(min, Math.min(max, numValue));
        if (clampedValue !== value) {
          onChange(clampedValue);
        }
        setInputValue(clampedValue.toString());
      }
    }
  };

  return (
    <div className={`flex items-center border border-input rounded-md bg-background ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors rounded-l-md"
      >
        <Minus className="h-4 w-4" />
      </button>
      
      <input
        id={id}
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="flex-1 h-10 text-center border-0 bg-transparent text-sm focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
      />
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors rounded-r-md"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
} 