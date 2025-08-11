import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Yup schema
const schema = yup.object().shape({
  kycStatus: yup
    .string()
    .required("KYC status is required")
    .notOneOf([""], "Please select a valid KYC status"),
  remark: yup.string().required("Remark is required"),
});

const KycStatusForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      kycStatus: "",
      remark: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 dark:text-white"
    >
      {/* KYC Status Select */}
      <div className="flex flex-col">
        <label className="text-xl font-medium mb-1">Kyc Status</label>
        <select
          {...register("kycStatus")}
          className="bg-transparent border border-gray-600 rounded px-4 py-2 dark:text-white"
        >
          <option value="">Select Action</option>
          <option value="Pending" className="dark:bg-darkBlue">
            Pending
          </option>
          <option value="Verified" className="dark:bg-darkBlue">
            Verified
          </option>
          <option value="Rejected" className="dark:bg-darkBlue">
            Rejected
          </option>
        </select>
        {errors.kycStatus && (
          <span className="text-xs text-red-400 mt-1">
            {errors.kycStatus.message}
          </span>
        )}
      </div>

      {/* Remark Input */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Remark</label>
        <input
          {...register("remark")}
          placeholder="Enter remark"
          className="bg-transparent border border-gray-600 rounded px-4 py-2 dark:text-white"
        />
        {errors.remark && (
          <span className="text-xs text-red-400 mt-1">
            {errors.remark.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="bg-secondary dark:text-white px-6 py-2 rounded-md mt-4 hover:opacity-90 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default KycStatusForm;
