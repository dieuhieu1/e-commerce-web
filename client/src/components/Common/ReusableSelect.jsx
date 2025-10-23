import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ReusableSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 transition">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                option.color || ""
              }`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ReusableSelect;
