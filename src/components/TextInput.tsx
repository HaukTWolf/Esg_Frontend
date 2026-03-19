import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fullWidth?: boolean;
}

function TextInput({ label, fullWidth = false, className = '', ...props }: TextInputProps) {
  const classes = ['text-input-field', fullWidth ? 'text-input-field-full-width' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes}>
      <span className="text-input-label">{label}</span>
      <input className="text-input-control" {...props} />
    </label>
  );
}

export default TextInput;
