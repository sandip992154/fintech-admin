
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Card = ({ title, label, placeholder }) => {
  const formik = useFormik({
    initialValues: {
      input: '',
    },
    validationSchema: Yup.object({
      input: Yup.string().required(`${label} is required`),
    }),
    onSubmit: (values) => {
      alert(`${title}: ${values.input}`);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="dark:bg-[#1C1E32] dark:text-white p-5 rounded-xl shadow-md w-full sm:w-80 lg:w-96"
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <label className="text-sm dark:text-gray-300">{label}</label>
      <input
        id="input"
        name="input"
        type="text"
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.input}
        className="mt-1 w-full p-2 rounded-md border border-[#2A2D4A]  dark:bg-transparent dark:text-white outline-none"
      />
      {formik.touched.input && formik.errors.input ? (
        <div className="text-red-400 text-sm mt-1">{formik.errors.input}</div>
      ) : null}
      <button
        type="submit"
        className="mt-4 bg-[#7C3AED] hover:bg-purple-700 dark:text-white py-2 px-4 rounded-md w-half"
      >
        Update Info
      </button>
    </form>
  );
};


const Cards = () => {
  const cardData = [
    { title: "Wallet Settlement Type", label: "Settlement Type", placeholder: "Auto" },
    { title: "Bank Settlement Type", label: "Settlement Type", placeholder: "Auto" },
    { title: "Bank Settlement Charge", label: "Charge", placeholder: "5" },
    { title: "Bank Settlement Charge Upto 25000", label: "Charge", placeholder: "5" },
    { title: "Login with OTP", label: "Login Type", placeholder: "Without Otp" },
    { title: "Sending mail id for OTP", label: "Mail Id", placeholder: "support@phonepays.in" },
    { title: "Sending mailer name id for otp", label: "Mailer Name", placeholder: "NK Tax Consultancy-Phone" },
    { title: "Transaction Id Code", label: "Code", placeholder: "PSP" },
    { title: "Main Wallet Locked Amount", label: "Amount", placeholder: "0" },
    { title: "Aeps Bank Settlement Locked Amount", label: "Amount", placeholder: "0" },
  ];

  return (
    <div className="min-h-screen dark:bg-[#121428] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-6">
      {cardData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          label={card.label}
          placeholder={card.placeholder}
        />
      ))}
    </div>
  );
};

export default Cards;


