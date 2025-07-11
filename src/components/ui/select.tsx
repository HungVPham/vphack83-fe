import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

// Vietnamese accent normalization function
const normalizeVietnamese = (str: string): string => {
  const accents = {
    'àáạảãâầấậẩẫăằắặẳẵ': 'a',
    'èéẹẻẽêềếệểễ': 'e',
    'ìíịỉĩ': 'i',
    'òóọỏõôồốộổỗơờớợởỡ': 'o',
    'ùúụủũưừứựửữ': 'u',
    'ỳýỵỷỹ': 'y',
    'đ': 'd',
    'ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ': 'A',
    'ÈÉẸẺẼÊỀẾỆỂỄ': 'E',
    'ÌÍỊỈĨ': 'I',
    'ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ': 'O',
    'ÙÚỤỦŨƯỪỨỰỬỮ': 'U',
    'ỲÝỴỶỸ': 'Y',
    'Đ': 'D'
  };
  
  let result = str;
  for (const [accented, base] of Object.entries(accents)) {
    for (const char of accented) {
      result = result.replace(new RegExp(char, 'g'), base);
    }
  }
  return result;
};

export function Select({
  options,
  value,
  placeholder = "Chọn một tùy chọn",
  onChange,
  className = "",
  disabled = false,
  id,
  searchable = true,
  searchPlaceholder = "Tìm kiếm...",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);

  // Filter options based on search query with Vietnamese accent normalization
  const filteredOptions = searchable && searchQuery
    ? options.filter(option => {
        const normalizedLabel = normalizeVietnamese(option.label.toLowerCase());
        const normalizedQuery = normalizeVietnamese(searchQuery.toLowerCase());
        return normalizedLabel.includes(normalizedQuery);
      })
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen, searchable]);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    } else if (event.key === "Enter") {
      event.preventDefault();
      // Select first filtered option if available
      if (filteredOptions.length > 0) {
        handleOptionClick(filteredOptions[0].value);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        id={id}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
          placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50
          ${isOpen ? "ring-2 ring-ring ring-offset-2" : ""}
        `}
      >
        <span className={selectedOption ? "text-foreground" : "text-muted-foreground"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 rounded-md border bg-white shadow-lg">
          {searchable && (
            <div className="relative border-b border-gray-200 p-2">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-3 py-1 text-sm border-none outline-none focus:ring-0 bg-transparent placeholder:text-gray-400"
              />
            </div>
          )}
          <div className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  className={`
                    w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 transition-colors
                    ${value === option.value ? "bg-gray-100 text-gray-900" : "text-gray-700"}
                  `}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 