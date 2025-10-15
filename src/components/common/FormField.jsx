/**
 * Reusable Form Field Component
 * Handles different input types with consistent styling and validation
 */
import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCreditCard,
  FiUsers,
  FiGlobe,
} from "react-icons/fi";

// Icon mapping
const iconMap = {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiCreditCard,
  FiUsers,
  FiGlobe,
};

const FormField = ({
  field,
  register,
  error,
  options = [],
  disabled = false,
  className = "",
  onChange,
  transform,
  ...rest
}) => {
  const {
    label,
    placeholder,
    type,
    required,
    icon,
    maxLength,
    rows,
    dependsOn,
  } = field;

  // Get icon component
  const IconComponent = iconMap[icon] || FiUser;

  // Base input classes
  const baseInputClass = `
    px-4 py-2 bg-transparent rounded ring-1 ring-gray-600 
    focus:outline-none focus:ring-2 focus:ring-primary w-full
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-200
  `;

  // Handle input change with transformation
  const handleChange = (e) => {
    if (transform) {
      switch (transform) {
        case "uppercase":
          e.target.value = e.target.value.toUpperCase();
          break;
        case "lowercase":
          e.target.value = e.target.value.toLowerCase();
          break;
        case "numeric":
          e.target.value = e.target.value.replace(/\D/g, "");
          break;
        default:
          break;
      }
    }
    if (onChange) {
      onChange(e);
    }
  };

  // Render different input types
  const renderInput = () => {
    const commonProps = {
      ...register,
      className: `${baseInputClass} ${className}`,
      placeholder,
      disabled,
      maxLength,
      onChange: handleChange,
      ...rest,
    };

    switch (type) {
      case "textarea":
        return <textarea {...commonProps} rows={rows || 3} />;

      case "select":
        return (
          <select {...commonProps}>
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option
                key={option.value || option}
                value={option.value || option}
              >
                {option.label || option}
              </option>
            ))}
          </select>
        );

      case "tel":
        return (
          <input
            {...commonProps}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            onChange={(e) => {
              // Only allow numbers for phone fields
              e.target.value = e.target.value.replace(/\D/g, "");
              handleChange(e);
            }}
          />
        );

      case "email":
        return <input {...commonProps} type="email" />;

      case "password":
        return <input {...commonProps} type="password" />;

      case "number":
        return <input {...commonProps} type="number" />;

      case "date":
        return <input {...commonProps} type="date" />;

      case "file":
        return (
          <input
            {...commonProps}
            type="file"
            className={`${baseInputClass} ${className} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark`}
          />
        );

      default:
        return <input {...commonProps} type="text" />;
    }
  };

  return (
    <div
      className={`form-field ${
        type === "select" && dependsOn ? "dependent-field" : ""
      }`}
    >
      {/* Label */}
      <label className="block text-sm font-medium text-gray-300 mb-2">
        <div className="flex items-center space-x-2">
          <IconComponent className="w-4 h-4" />
          <span>
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </span>
        </div>
      </label>

      {/* Input */}
      <div className="relative">
        {renderInput()}

        {/* Loading indicator for dependent fields */}
        {type === "select" && disabled && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-400 text-sm mt-1 flex items-center">
          <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
          {error}
        </p>
      )}

      {/* Helper text for special fields */}
      {type === "tel" && !error && (
        <p className="text-gray-500 text-xs mt-1">
          Enter 10-digit mobile number without country code
        </p>
      )}

      {field.name === "panCard" && !error && (
        <p className="text-gray-500 text-xs mt-1">
          Format: ABCDE1234F (5 letters, 4 digits, 1 letter)
        </p>
      )}

      {field.name === "domain" && !error && (
        <p className="text-gray-500 text-xs mt-1">
          Enter domain without http:// or https://
        </p>
      )}
    </div>
  );
};

// Wrapper component for easier use with react-hook-form
export const FormFieldWrapper = ({
  fieldName,
  fieldConfig,
  register,
  errors,
  ...props
}) => {
  return (
    <FormField
      field={{ name: fieldName, ...fieldConfig }}
      register={register(fieldName)}
      error={errors[fieldName]?.message}
      {...props}
    />
  );
};

// Section wrapper component
export const FormSection = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};

// Form grid container
export const FormGrid = ({ children, columns = 2 }) => {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return <div className={`grid ${gridClass} gap-6`}>{children}</div>;
};

export default FormField;
