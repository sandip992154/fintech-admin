import React from "react";

const ServiceCard = ({ title, services }) => {
  return (
    <div className="border border-dashed border-gray-400 rounded-xl p-4  ">
      <h2 className=" font-semibold text-lg mb-4">{title}</h2>
      <div className="grid grid-cols-4 gap-4">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-green-600 cursor-pointer hover:text-black transition-colors"
          >
            <div className="text-2xl bg-yellow-900/10 p-4 rounded-full mb-1">
              {service.icon}
            </div>
            <span className="text-xs text-center">{service.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;
