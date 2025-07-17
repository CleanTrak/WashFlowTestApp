import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1 text-sm";
      default:
        return "px-4 py-2";
    }
  };

  const baseClass = `${getSizeClasses()} ${getVariantClasses()} rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors`;

  const getSpinnerColor = () => {
    switch (variant) {
      case "secondary":
        return "border-gray-600 border-t-transparent";
      default:
        return "border-white border-t-transparent";
    }
  };

  return (
    <button
      className={`${baseClass} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span
            className={`inline-block w-4 h-4 mr-2 border-2 ${getSpinnerColor()} rounded-full animate-spin`}
          ></span>
          {loadingText || "Loading..."}
        </>
      ) : (
        children
      )}
    </button>
  );
};
