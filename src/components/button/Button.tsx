import React from "react";
// import styles from './styles.module.css'; // optional

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      //   className={`${styles.btn} ${className || ''}`}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
