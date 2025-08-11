import { PortalSettingsCardForm } from "../../components/setup_tools/PortalSettingsCardForm";

export const PortalSetting = () => {
  const cardData = [
    {
      title: "Wallet Settlement Type",
      label: "Settlement Type",
      placeholder: "Auto",
    },
    {
      title: "Bank Settlement Type",
      label: "Settlement Type",
      placeholder: "Auto",
    },
    { title: "Bank Settlement Charge", label: "Charge", placeholder: "5" },
    {
      title: "Bank Settlement Charge Upto 25000",
      label: "Charge",
      placeholder: "5",
    },
    {
      title: "Login with OTP",
      label: "Login Type",
      placeholder: "Without Otp",
    },
    {
      title: "Sending mail id for OTP",
      label: "Mail Id",
      placeholder: "support@phonepays.in",
    },
    {
      title: "Sending mailer name id for otp",
      label: "Mailer Name",
      placeholder: "NK Tax Consultancy-Phone",
    },
    { title: "Transaction Id Code", label: "Code", placeholder: "PSP" },
    { title: "Main Wallet Locked Amount", label: "Amount", placeholder: "0" },
    {
      title: "Aeps Bank Settlement Locked Amount",
      label: "Amount",
      placeholder: "0",
    },
  ];

  return (
    <div className="h-[90vh] 2xl:max-w-[80%]  p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="grid grid-cols-3 items-center gap-4">
        {cardData.map((card, index) => (
          <PortalSettingsCardForm
            key={index}
            title={card.title}
            label={card.label}
            placeholder={card.placeholder}
          />
        ))}
      </div>
    </div>
  );
};
