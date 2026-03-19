import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = [
    'app-button',
    variant === 'secondary' ? 'app-button-secondary' : 'app-button-primary',
    fullWidth ? 'app-button-full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} type={type} {...props} />;
}

export default Button;
