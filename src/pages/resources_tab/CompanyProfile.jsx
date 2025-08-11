import { useState } from "react";
import {
  FaHome,
  FaUser,
  FaBullhorn,
  FaNewspaper,
  FaPhone,
} from "../../assets/react-icons";

// tabs
const tabs = [
  {
    id: "details",
    label: "Company Details",
    icon: <FaHome className="inline mr-2" />,
  },
  {
    id: "logo",
    label: "Company Logo",
    icon: <FaUser className="inline mr-2" />,
  },
  {
    id: "news",
    label: "Company News",
    icon: <FaNewspaper className="inline mr-2" />,
  },
  {
    id: "notice",
    label: "Company Notice",
    icon: <FaBullhorn className="inline mr-2" />,
  },
  {
    id: "support",
    label: "Support",
    icon: <FaPhone className="inline mr-2" />,
  },
];

// company details fileds
const companyDetailFields = [
  {
    id: "name",
    placeholder: "Company Name",
    label: "Company Name",
  },
  {
    id: "fullName",
    placeholder: "Company Full Name",
    label: "Company Full Name (As per Registered Document)",
  },
  {
    id: "website",
    placeholder: "Company Website",
    label: "Company Website",
  },
];

export function CompanyProfile() {
  const [activeTab, setActiveTab] = useState("details");

  const [companyDetails, setCompanyDetails] = useState({
    name: "NK TAX CONSULTANCY",
    fullName: "NK TAX CONSULTANCY",
    website: "login.phonesepay.in",
  });

  const [news, setNews] = useState({
    newsText: "HI NK USERS, PG WILL BE LIVE FROM AUG 1st",
    billNotice: "",
  });

  const [notice, setNotice] = useState("");

  const [support, setSupport] = useState({
    contact: "9059207545",
    email: "support@phonesepay.in",
  });

  // file Drop Handlers
  const [logo, setLogo] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setLogo(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // submit handler
  const handleSubmit = (section) => {
    switch (section) {
      case "details":
        console.log("Company Details Submitted:", companyDetails);
        break;
      case "logo":
        console.log("Company Logo Submitted:", logo);
        break;
      case "news":
        console.log("Company News Submitted:", news);
        break;
      case "notice":
        console.log("Company Notice Submitted:", notice);
        break;
      case "support":
        console.log("Company Support Details Submitted:", support);
        break;
      default:
        break;
    }
  };

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-white mt-4 dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        Company Setting
      </h2>

      <div className="flex  items-center justify-between gap-4 mb-6 border-b border-gray-700 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-md text-sm font-medium ${
              activeTab === tab.id
                ? "bg-secondary text-white"
                : "bg-transparent text-gray-400 hover:text-secondary"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* comapany details */}
      {activeTab === "details" && (
        <div className="grid grid-cols-3 gap-4">
          {companyDetailFields.map((field, index) => (
            <div className="flex flex-col space-y-3" key={index}>
              <label className="dark:text-slate-400">{field.label}</label>
              <input
                key={field.id}
                type="text"
                placeholder={field.placeholder}
                className="p-2 rounded ring-1 ring-slate-400 dark:text-adminOffWhite text-sm"
                value={companyDetails[field.id]}
                onChange={(e) =>
                  setCompanyDetails({
                    ...companyDetails,
                    [field.id]: e.target.value,
                  })
                }
              />
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit("details")}
              className="bg-secondary  text-white font-medium px-6 py-2 rounded-md"
            >
              Update Info
            </button>
          </div>
        </div>
      )}

      {/* company log */}
      {activeTab === "logo" && (
        <div>
          <div
            className={`border-2 border-dashed rounded-xl p-20 bg-white text-gray-400 flex items-center justify-center transition-colors duration-200 ${
              isDragging ? "border-secondary bg-[#f6f3ff]" : "border-gray-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              onChange={(e) => setLogo(e.target.files[0])}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="text-center cursor-pointer">
              {logo ? (
                <p className="text-black">{logo.name}</p>
              ) : (
                <div>
                  <p className="text-black font-medium">
                    Drag & Drop your logo here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to browse
                  </p>
                </div>
              )}
            </label>
          </div>

          <p className="text-sm mt-2 text-center text-gray-400">
            Preferred image size is 34px * 24px
          </p>

          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit("logo")}
              className="bg-secondary  text-white font-medium px-6 py-2 mt-4 rounded-md"
            >
              Upload Logo
            </button>
          </div>
        </div>
      )}

      {/* company news */}
      {activeTab === "news" && (
        <div className="grid grid-cols-2 gap-4 ">
          <div className=" flex flex-col space-y-3">
            <label htmlFor="news" className="dark:text-slate-400">
              News
            </label>
            <textarea
              id="news"
              className="p-2 rounded ring-1 ring-slate-400 dark:text-adminOffWhite"
              value={news.newsText}
              onChange={(e) => setNews({ ...news, newsText: e.target.value })}
              rows="5"
            ></textarea>
          </div>
          <div className=" flex flex-col space-y-3">
            <label htmlFor="news" className="dark:text-slate-400">
              Bill Notice
            </label>
            <textarea
              className="p-2 rounded ring-1 ring-slate-400 dark:text-adminOffWhite"
              value={news.billNotice}
              onChange={(e) => setNews({ ...news, billNotice: e.target.value })}
              rows="5"
            ></textarea>
          </div>
          <div className="flex justify-end col-end-3">
            <button
              onClick={() => handleSubmit("news")}
              className="bg-secondary  text-white font-medium px-6 py-2 rounded-md"
            >
              Update Info
            </button>
          </div>
        </div>
      )}

      {/* company notice */}
      {activeTab === "notice" && (
        <div className="">
          <textarea
            placeholder="Write company notice here..."
            rows={10}
            className="p-2 rounded ring-1 dark:bg-[#2A2D3E] dark:text-adminOffWhite w-full"
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
          ></textarea>
          <div className="flex justify-end">
            <button
              onClick={() => handleSubmit("notice")}
              className="bg-secondary  dark:text-adminOffWhite font-medium px-6 py-2 mt-4 rounded-md"
            >
              Update Info
            </button>
          </div>
        </div>
      )}
      {/* company support */}
      {activeTab === "support" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-3">
            <label htmlFor="contact-number" className="dark:text-slate-400">
              Contact Number
            </label>
            <textarea
              id="contact-number"
              placeholder="Contact Number"
              className="p-2 rounded ring-1 ring-slate-400 dark:text-adminOffWhite"
              value={support.contact}
              onChange={(e) =>
                setSupport({ ...support, contact: e.target.value })
              }
            ></textarea>
          </div>
          <div className="flex flex-col space-y-3">
            <label htmlFor="contact-email" className="dark:text-slate-400">
              Contact Number
            </label>
            <textarea
              id="contact-email"
              placeholder="Contact Email"
              className="p-2 rounded ring-1 ring-slate-400 dark:text-adminOffWhite"
              value={support.email}
              onChange={(e) =>
                setSupport({ ...support, email: e.target.value })
              }
            ></textarea>
          </div>
          <div className="flex justify-end col-end-3">
            <button
              onClick={() => handleSubmit("support")}
              className="bg-secondary  text-white font-medium px-6 py-2 rounded-md"
            >
              Update Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
