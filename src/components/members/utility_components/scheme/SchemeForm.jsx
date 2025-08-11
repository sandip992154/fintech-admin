import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  scheme: yup.string().required("Please select a scheme"),
});

const SchemeForm = ({ onSubmit, schemeOptions = [] }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-end gap-4 flex-wrap"
    >
      <div className="flex flex-col">
        <label className="dark:text-white text-sm mb-1">Scheme</label>
        <select
          {...register("scheme")}
          className="w-64 px-4 py-2 rounded-md bg-transparent border border-gray-600 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          <option value="" className="dark:bg-darkBlue">
            Select Scheme
          </option>
          {schemeOptions.map((opt, idx) => (
            <option key={idx} value={opt} className="dark:bg-darkBlue ">
              {opt}
            </option>
          ))}
        </select>
        {errors.scheme && (
          <p className="text-red-400 text-xs mt-1">{errors.scheme.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="h-10 px-6 rounded-md cursor-pointer bg-secondary text-white text-sm hover:opacity-90 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default SchemeForm;
