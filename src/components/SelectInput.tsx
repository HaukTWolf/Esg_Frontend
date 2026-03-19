import type { SelectHTMLAttributes } from 'react';
import type { SelectOption } from '../types';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
}

function SelectInput({ label, options, className = '', ...props }: SelectInputProps) {
  const classes = ['select-input-field', className].filter(Boolean).join(' ');

  return (
    <label className={classes}>
      <span className="select-input-label">{label}</span>
      <select className="select-input-control" {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default SelectInput;
