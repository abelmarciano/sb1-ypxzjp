import React from 'react';

interface RowsPerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: number[];
}

export function RowsPerPageSelect({ value, onChange, options }: RowsPerPageSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-500">Lignes par page:</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="text-sm border rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}