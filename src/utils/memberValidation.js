/**
 * Shared Member Form Validation Schemas
 * Centralized validation logic for all member creation forms
 */
import * as yup from "yup";

// Common validation patterns
const patterns = {
  mobile: /^[6-9]\d{9}$/, // Indian mobile number pattern
  pinCode: /^\d{6}$/, // 6-digit pincode
  panCard: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // PAN card pattern
  aadhaar: /^\d{12}$/, // 12-digit Aadhaar
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Email pattern
  domain: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/, // Domain pattern
};

// Common error messages
const errorMessages = {
  required: (field) => `${field} is required`,
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  maxLength: (field, max) => `${field} must not exceed ${max} characters`,
  invalidFormat: (field) => `Please enter a valid ${field}`,
  mobile: "Please enter a valid 10-digit Indian mobile number",
  email: "Please enter a valid email address",
  pinCode: "Please enter a valid 6-digit PIN code",
  panCard: "Please enter a valid PAN card number (e.g., ABCDE1234F)",
  aadhaar: "Please enter a valid 12-digit Aadhaar number",
  domain: "Please enter a valid domain name (e.g., example.com)",
};

// Base validation fields (common to all member types)
const baseValidationFields = {
  name: yup
    .string()
    .min(2, errorMessages.minLength("Name", 2))
    .max(100, errorMessages.maxLength("Name", 100))
    .required(errorMessages.required("Name")),

  mobile: yup
    .string()
    .matches(patterns.mobile, errorMessages.mobile)
    .required(errorMessages.required("Mobile number")),

  email: yup
    .string()
    .matches(patterns.email, errorMessages.email)
    .required(errorMessages.required("Email")),

  address: yup
    .string()
    .min(10, errorMessages.minLength("Address", 10))
    .max(500, errorMessages.maxLength("Address", 500))
    .required(errorMessages.required("Address")),

  state: yup.string().required(errorMessages.required("State")),

  city: yup.string().required(errorMessages.required("City")),

  pinCode: yup
    .string()
    .matches(patterns.pinCode, errorMessages.pinCode)
    .required(errorMessages.required("PIN code")),

  shopName: yup
    .string()
    .min(2, errorMessages.minLength("Shop name", 2))
    .max(200, errorMessages.maxLength("Shop name", 200))
    .required(errorMessages.required("Shop name")),

  panCard: yup
    .string()
    .matches(patterns.panCard, errorMessages.panCard)
    .required(errorMessages.required("PAN card")),

  aadhaarCard: yup
    .string()
    .matches(patterns.aadhaar, errorMessages.aadhaar)
    .required(errorMessages.required("Aadhaar card")),

  scheme: yup.string().required(errorMessages.required("Scheme")),
};

// Extended validation fields for specific member types
const extendedValidationFields = {
  // Company fields for admin and whitelabel
  company: {
    companyName: yup
      .string()
      .min(2, errorMessages.minLength("Company name", 2))
      .max(200, errorMessages.maxLength("Company name", 200))
      .required(errorMessages.required("Company name")),

    domain: yup
      .string()
      .matches(patterns.domain, errorMessages.domain)
      .required(errorMessages.required("Domain")),
  },

  // Additional fields for specific roles
  business: {
    businessType: yup
      .string()
      .required(errorMessages.required("Business type")),

    gstNumber: yup
      .string()
      .matches(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Please enter a valid GST number"
      )
      .optional(),
  },

  // Banking fields
  banking: {
    accountNumber: yup
      .string()
      .min(9, errorMessages.minLength("Account number", 9))
      .max(18, errorMessages.maxLength("Account number", 18))
      .required(errorMessages.required("Account number")),

    ifscCode: yup
      .string()
      .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please enter a valid IFSC code")
      .required(errorMessages.required("IFSC code")),

    bankName: yup.string().required(errorMessages.required("Bank name")),

    branchName: yup.string().required(errorMessages.required("Branch name")),
  },
};

// Schema factory function to create validation schemas based on member type
export const createMemberValidationSchema = (memberType, options = {}) => {
  let fields = { ...baseValidationFields };

  // Add fields based on member type
  switch (memberType.toLowerCase()) {
    case "admin":
    case "whitelabel":
      fields = { ...fields, ...extendedValidationFields.company };
      break;

    case "mds":
    case "distributor":
      // MDS and distributors might need business fields
      if (options.includeBusiness) {
        fields = { ...fields, ...extendedValidationFields.business };
      }
      break;

    case "retailer":
      // Retailers might need banking fields
      if (options.includeBanking) {
        fields = { ...fields, ...extendedValidationFields.banking };
      }
      break;

    case "customer":
      // Customers have minimal additional requirements
      break;

    default:
      console.warn(
        `Unknown member type: ${memberType}. Using base validation.`
      );
  }

  // Add optional fields if specified
  if (options.includeCompany) {
    fields = { ...fields, ...extendedValidationFields.company };
  }
  if (options.includeBusiness) {
    fields = { ...fields, ...extendedValidationFields.business };
  }
  if (options.includeBanking) {
    fields = { ...fields, ...extendedValidationFields.banking };
  }

  return yup.object().shape(fields);
};

// Pre-built schemas for common member types
export const memberValidationSchemas = {
  admin: createMemberValidationSchema("admin"),
  whitelabel: createMemberValidationSchema("whitelabel"),
  mds: createMemberValidationSchema("mds"),
  distributor: createMemberValidationSchema("distributor"),
  retailer: createMemberValidationSchema("retailer"),
  customer: createMemberValidationSchema("customer"),
};

// Validation helper functions
export const validateField = async (schema, fieldName, value) => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

export const validateForm = async (schema, formData) => {
  try {
    await schema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};

// Form field configurations
export const fieldConfigurations = {
  name: {
    label: "Full Name",
    placeholder: "Enter full name",
    type: "text",
    required: true,
    icon: "FiUser",
  },
  mobile: {
    label: "Mobile Number",
    placeholder: "Enter 10-digit mobile number",
    type: "tel",
    required: true,
    icon: "FiPhone",
    maxLength: 10,
  },
  email: {
    label: "Email Address",
    placeholder: "Enter email address",
    type: "email",
    required: true,
    icon: "FiMail",
  },
  address: {
    label: "Address",
    placeholder: "Enter complete address",
    type: "textarea",
    required: true,
    icon: "FiMapPin",
    rows: 3,
  },
  state: {
    label: "State",
    placeholder: "Select State",
    type: "select",
    required: true,
    icon: "FiMapPin",
  },
  city: {
    label: "City",
    placeholder: "Select City",
    type: "select",
    required: true,
    icon: "FiMapPin",
    dependsOn: "state",
  },
  pinCode: {
    label: "PIN Code",
    placeholder: "Enter 6-digit PIN code",
    type: "text",
    required: true,
    icon: "FiMapPin",
    maxLength: 6,
  },
  shopName: {
    label: "Shop Name",
    placeholder: "Enter shop name",
    type: "text",
    required: true,
    icon: "FiBriefcase",
  },
  panCard: {
    label: "PAN Card",
    placeholder: "Enter PAN card number",
    type: "text",
    required: true,
    icon: "FiCreditCard",
    maxLength: 10,
    transform: "uppercase",
  },
  aadhaarCard: {
    label: "Aadhaar Card",
    placeholder: "Enter Aadhaar card number",
    type: "text",
    required: true,
    icon: "FiCreditCard",
    maxLength: 12,
  },
  scheme: {
    label: "Scheme",
    placeholder: "Select Scheme",
    type: "select",
    required: true,
    icon: "FiUsers",
  },
  companyName: {
    label: "Company Name",
    placeholder: "Enter company name",
    type: "text",
    required: true,
    icon: "FiBriefcase",
  },
  domain: {
    label: "Domain",
    placeholder: "Enter domain (e.g., example.com)",
    type: "text",
    required: true,
    icon: "FiGlobe",
    transform: "lowercase",
  },
};

export default {
  createMemberValidationSchema,
  memberValidationSchemas,
  validateField,
  validateForm,
  fieldConfigurations,
  patterns,
  errorMessages,
};
