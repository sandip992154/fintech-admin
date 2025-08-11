import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Config-based field definitions
const FIELD_CONFIG = [
  {
    label: "Wallet Type",
    name: "walletType",
    type: "select",
    options: ["Paytm", "PhonePe", "GooglePay"],
    required: true,
  },
  {
    label: "A/C Holder Name",
    name: "accountHolder",
    type: "text",
    readOnly: true,
    required: true,
  },
  {
    label: "Account Number",
    name: "accountNumber",
    type: "text",
    readOnly: true,
    required: true,
  },
  {
    label: "IFSC Code",
    name: "ifscCode",
    type: "text",
    readOnly: true,
    required: true,
  },
  {
    label: "Bank Name",
    name: "bankName",
    type: "text",
    required: true,
  },
  {
    label: "Amount",
    name: "amount",
    type: "number",
    required: true,
    placeholder: "Enter Value",
    min: 100,
  },
  {
    label: "Remarks",
    name: "remarks",
    type: "text",
    required: true,
    placeholder: "Enter Value",
    full: true,
  },
  {
    label: "T-PIN",
    name: "tpin",
    type: "password",
    required: true,
    placeholder: "Enter transaction pin",
    full: true,
  },
];

// Initial default values
const defaultValues = {
  walletType: "",
  accountHolder: "BANDARU KISHOR",
  accountNumber: "50200071035081",
  ifscCode: "HDFC0005853",
  bankName: "hdfc",
  amount: "",
  remarks: "",
  tpin: "",
};

// Yup validation schema
const schema = yup.object().shape({
  walletType: yup.string().required("Wallet Type is required"),
  accountHolder: yup.string().required("A/C Holder Name is required"),
  accountNumber: yup.string().required("Account Number is required"),
  ifscCode: yup.string().required("IFSC Code is required"),
  bankName: yup.string().required("Bank Name is required"),
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .required("Amount is required")
    .min(100, "Amount must be at least 100"),
  remarks: yup.string().required("Remarks are required"),
  tpin: yup.string().required("T-PIN is required"),
});

const BankTransferForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleChange = (name) => (e) => {
    clearErrors();
    register(name).onChange(e);
  };

  const onSubmit = (data) => {
    console.log("✅ Valid Data Submitted:", data);
    // Submit logic
  };

  return (
    <div className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-400 rounded-xl p-2 dark:text-white">
      <h1 className="dark:text-secondary font-bold mb-4 text-2xl text-center text-secondary">
        CC Settlement
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {FIELD_CONFIG.map((field, index) => (
          <div key={index} className={field.full ? "md:col-span-2" : ""}>
            <label className="block mb-1">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "select" ? (
              <select
                {...register(field.name)}
                onChange={handleChange(field.name)}
                className={`w-full p-2 rounded-md bg-transparent border ${
                  errors[field.name] ? "border-red-500" : "border-gray-500"
                } focus:outline-none`}
              >
                <option value="" className="dark:bg-darkBlue">
                  Select {field.label}
                </option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt} className="dark:bg-darkBlue">
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register(field.name)}
                type={field.type}
                placeholder={field.placeholder || ""}
                readOnly={field.readOnly}
                min={field.min}
                onChange={handleChange(field.name)}
                className={`w-full p-2 rounded-md bg-transparent border ${
                  errors[field.name] ? "border-red-500" : "border-gray-500"
                } focus:outline-none`}
              />
            )}

            {errors[field.name] && (
              <p className="text-sm text-red-500 mt-1">
                {errors[field.name]?.message}
              </p>
            )}

            {field.name === "tpin" && (
              <div className="text-sm text-blue-400 mt-1 cursor-pointer hover:underline">
                Generate or Forgot PIN?
              </div>
            )}
          </div>
        ))}

        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-secondary hover:bg-secondary px-6 py-2 rounded-md text-white font-semibold"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankTransferForm;
