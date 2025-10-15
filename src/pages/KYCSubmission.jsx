import React, { useState, useEffect } from "react";
import {
  FiUpload,
  FiCheck,
  FiX,
  FiFileText,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import WhitelabelKYCService from "../services/kycService";
import { toast } from "react-toastify";

const KYCSubmission = () => {
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    date_of_birth: "",
    gender: "",

    // Contact Information
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin_code: "",

    // Parent/Referral Information
    parent_user_code: "",
    parent_user_id: "",

    // Business Information (for whitelabel)
    business_name: "",
    business_type: "",
    gst_number: "",
    business_address: "",
    company_pan_number: "",

    // Bank Details
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    account_holder_name: "",
    branch_name: "",

    // Document Information
    aadhar_number: "",
    pan_number: "",

    // Document Files
    aadhar_card: null,
    pan_card: null,
    company_pan_card: null,
    photo: null,
    signature: null,
    business_license: null,
    gst_certificate: null,
  });

  const [preview, setPreview] = useState({
    aadhar_card: null,
    pan_card: null,
    photo: null,
    signature: null,
    business_license: null,
    gst_certificate: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    checkKYCStatus();
  }, []);

  const checkKYCStatus = async () => {
    try {
      setLoading(true);
      const response = await WhitelabelKYCService.getKYCStatus();
      setKycStatus(response.data);

      // If KYC exists, populate form with existing data
      if (response.data && response.data.status !== "not_submitted") {
        const details = await WhitelabelKYCService.getKYCDetails();
        if (details.data) {
          setFormData((prev) => ({
            ...prev,
            ...details.data,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "File size must be less than 5MB",
        }));
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Only JPG, PNG, and PDF files are allowed",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview((prev) => ({
            ...prev,
            [fieldName]: e.target.result,
          }));
        };
        reader.readAsDataURL(file);
      }

      // Clear error
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validateStep1 = () => {
    const stepErrors = {};

    if (!formData.full_name?.trim())
      stepErrors.full_name = "Full name is required";
    if (!formData.date_of_birth)
      stepErrors.date_of_birth = "Date of birth is required";
    if (!formData.gender) stepErrors.gender = "Gender is required";

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors = {};

    if (!formData.email?.trim()) stepErrors.email = "Email is required";
    if (!formData.phone?.trim()) stepErrors.phone = "Phone number is required";
    if (!formData.address?.trim()) stepErrors.address = "Address is required";
    if (!formData.city?.trim()) stepErrors.city = "City is required";
    if (!formData.state?.trim()) stepErrors.state = "State is required";
    if (!formData.pin_code?.trim())
      stepErrors.pin_code = "PIN code is required";

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      stepErrors.email = "Invalid email format";
    }

    // Validate phone format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      stepErrors.phone = "Invalid phone number format";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = () => {
    const stepErrors = {};

    if (!formData.business_name?.trim())
      stepErrors.business_name = "Business name is required";
    if (!formData.business_type)
      stepErrors.business_type = "Business type is required";
    if (!formData.business_address?.trim())
      stepErrors.business_address = "Business address is required";
    if (!formData.company_pan_number?.trim())
      stepErrors.company_pan_number = "Company PAN number is required";

    // Validate Company PAN number format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (
      formData.company_pan_number &&
      !panRegex.test(formData.company_pan_number.toUpperCase())
    ) {
      stepErrors.company_pan_number = "Invalid Company PAN number format";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep4 = () => {
    const stepErrors = {};

    if (!formData.bank_name?.trim())
      stepErrors.bank_name = "Bank name is required";
    if (!formData.account_number?.trim())
      stepErrors.account_number = "Account number is required";
    if (!formData.ifsc_code?.trim())
      stepErrors.ifsc_code = "IFSC code is required";
    if (!formData.account_holder_name?.trim())
      stepErrors.account_holder_name = "Account holder name is required";
    if (!formData.branch_name?.trim())
      stepErrors.branch_name = "Branch name is required";

    // Validate IFSC code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (
      formData.ifsc_code &&
      !ifscRegex.test(formData.ifsc_code.toUpperCase())
    ) {
      stepErrors.ifsc_code = "Invalid IFSC code format";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep5 = () => {
    const stepErrors = {};

    if (!formData.aadhar_number?.trim())
      stepErrors.aadhar_number = "Aadhar number is required";
    if (!formData.pan_number?.trim())
      stepErrors.pan_number = "PAN number is required";
    if (!formData.aadhar_card)
      stepErrors.aadhar_card = "Aadhar card document is required";
    if (!formData.pan_card)
      stepErrors.pan_card = "PAN card document is required";
    if (!formData.company_pan_card)
      stepErrors.company_pan_card = "Company PAN card document is required";
    if (!formData.photo) stepErrors.photo = "Photo is required";

    // Validate Aadhar number format
    const aadharRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;
    if (formData.aadhar_number && !aadharRegex.test(formData.aadhar_number)) {
      stepErrors.aadhar_number = "Invalid Aadhar number format";
    }

    // Validate PAN number format
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (
      formData.pan_number &&
      !panRegex.test(formData.pan_number.toUpperCase())
    ) {
      stepErrors.pan_number = "Invalid PAN number format";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;

    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      case 5:
        isValid = validateStep5();
        break;
      default:
        isValid = true;
    }

    if (isValid && step < 5) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked!");

    const validationResult = validateStep5();
    console.log("Validation result:", validationResult);
    if (!validationResult) {
      console.log("Validation failed, errors:", errors);
      toast.error(
        "Please fill in all required fields and upload necessary documents.",
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
      return;
    }

    try {
      setSubmitting(true);
      console.log("Creating FormData with:", formData);

      // Create FormData for file upload
      const submitData = new FormData();

      // Append only required fields that backend expects
      // Required fields
      if (formData.aadhar_number) {
        submitData.append("aadhar_number", formData.aadhar_number);
      }
      if (formData.pan_number) {
        submitData.append("pan_number", formData.pan_number);
      }

      // Optional text fields (only if not empty)
      const optionalFields = [
        "full_name",
        "date_of_birth",
        "gender",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "pin_code",
        "business_name",
        "business_type",
        "business_address",
        "company_pan_number",
        "bank_name",
        "account_number",
        "ifsc_code",
        "account_holder_name",
        "branch_name",
      ];

      optionalFields.forEach((field) => {
        if (formData[field] && formData[field].trim() !== "") {
          submitData.append(field, formData[field].trim());
        }
      });

      // File fields
      const fileFields = [
        "aadhar_card",
        "pan_card",
        "company_pan_card",
        "photo",
        "signature",
        "business_license",
        "gst_certificate",
      ];
      fileFields.forEach((field) => {
        if (formData[field] && formData[field] instanceof File) {
          submitData.append(field, formData[field]);
        }
      });

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      console.log("Submitting KYC data...");
      // Submit or resubmit based on current status
      if (kycStatus?.status === "rejected" || kycStatus?.status === "draft") {
        await WhitelabelKYCService.resubmitKYC(submitData);
      } else {
        await WhitelabelKYCService.submitKYC(submitData);
      }

      toast.success(
        "KYC application submitted successfully! Redirecting to dashboard...",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      // Refresh status first
      await checkKYCStatus();

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting KYC:", error);
      toast.error(
        `Failed to submit KYC application: ${
          error.response?.data?.detail || error.message
        }`,
        {
          position: "top-right",
          autoClose: 7000,
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "text-yellow-600 bg-yellow-100",
      approved: "text-green-600 bg-green-100",
      rejected: "text-red-600 bg-red-100",
      under_review: "text-blue-600 bg-blue-100",
      draft: "text-gray-600 bg-gray-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KYC information...</p>
        </div>
      </div>
    );
  }

  // Show status if KYC is already submitted and approved
  if (kycStatus?.status === "approved") {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiCheck className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              KYC Approved
            </h2>
            <p className="text-gray-600 mb-4">
              Your KYC application has been approved. You can now access all
              whitelabel features.
            </p>
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
              <p className="text-sm text-green-700">
                <strong>Approved Date:</strong>{" "}
                {new Date(kycStatus.updated_at).toLocaleDateString()}
              </p>
              {kycStatus.admin_notes && (
                <p className="text-sm text-green-700 mt-2">
                  <strong>Notes:</strong> {kycStatus.admin_notes}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin KYC Verification
          </h1>
          <p className="text-gray-600">
            Complete your Know Your Customer verification to access whitelabel
            features
          </p>

          {kycStatus && kycStatus.status !== "not_submitted" && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      kycStatus.status
                    )}`}
                  >
                    {kycStatus.status?.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-sm font-medium">
                    {new Date(kycStatus.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {kycStatus.status === "rejected" &&
                kycStatus.rejection_reason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700">
                      <strong>Rejection Reason:</strong>{" "}
                      {kycStatus.rejection_reason}
                    </p>
                    {kycStatus.admin_notes && (
                      <p className="text-sm text-red-700 mt-1">
                        <strong>Admin Notes:</strong> {kycStatus.admin_notes}
                      </p>
                    )}
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className={`w-12 h-1 ${
                      step > stepNumber ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Personal Info</span>
            <span>Contact Info</span>
            <span>Business Info</span>
            <span>Bank Details</span>
            <span>Documents</span>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FiUser className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.full_name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.full_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.date_of_birth
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.date_of_birth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.date_of_birth}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.gender ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent/Referral User Code
                    </label>
                    <input
                      type="text"
                      name="parent_user_code"
                      value={formData.parent_user_code}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter parent user code (if applicable)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Parent/Referral User ID
                    </label>
                    <input
                      type="text"
                      name="parent_user_id"
                      value={formData.parent_user_id}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter parent user ID (if applicable)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FiMail className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your complete address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your state"
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pin_code"
                      value={formData.pin_code}
                      onChange={handleInputChange}
                      maxLength="6"
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.pin_code ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter PIN code"
                    />
                    {errors.pin_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pin_code}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Information */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FiMapPin className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Business Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="business_name"
                      value={formData.business_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.business_name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your business name"
                    />
                    {errors.business_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.business_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Type *
                    </label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.business_type
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Business Type</option>
                      <option value="proprietorship">
                        Sole Proprietorship
                      </option>
                      <option value="partnership">Partnership</option>
                      <option value="llp">Limited Liability Partnership</option>
                      <option value="private_limited">
                        Private Limited Company
                      </option>
                      <option value="public_limited">
                        Public Limited Company
                      </option>
                      <option value="other">Other</option>
                    </select>
                    {errors.business_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.business_type}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number
                    </label>
                    <input
                      type="text"
                      name="gst_number"
                      value={formData.gst_number}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter GST number (if applicable)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company PAN Number *
                    </label>
                    <input
                      type="text"
                      name="company_pan_number"
                      value={formData.company_pan_number}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.company_pan_number
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter company PAN number"
                    />
                    {errors.company_pan_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.company_pan_number}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Address *
                    </label>
                    <textarea
                      name="business_address"
                      value={formData.business_address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.business_address
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your business address"
                    />
                    {errors.business_address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.business_address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Bank Details */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FiFileText className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Bank Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.bank_name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter bank name"
                    />
                    {errors.bank_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.bank_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.account_number
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter account number"
                    />
                    {errors.account_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.account_number}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      name="ifsc_code"
                      value={formData.ifsc_code}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.ifsc_code ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter IFSC code"
                    />
                    {errors.ifsc_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.ifsc_code}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      name="account_holder_name"
                      value={formData.account_holder_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.account_holder_name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter account holder name"
                    />
                    {errors.account_holder_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.account_holder_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Name *
                    </label>
                    <input
                      type="text"
                      name="branch_name"
                      value={formData.branch_name}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.branch_name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter branch name"
                    />
                    {errors.branch_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.branch_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <FiFileText className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Document Upload
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhar Number *
                    </label>
                    <input
                      type="text"
                      name="aadhar_number"
                      value={formData.aadhar_number}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.aadhar_number
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="XXXX XXXX XXXX"
                    />
                    {errors.aadhar_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.aadhar_number}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number *
                    </label>
                    <input
                      type="text"
                      name="pan_number"
                      value={formData.pan_number}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${
                        errors.pan_number ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="ABCDE1234F"
                      style={{ textTransform: "uppercase" }}
                    />
                    {errors.pan_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pan_number}
                      </p>
                    )}
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Personal Document Uploads */}
                  {[
                    "aadhar_card",
                    "pan_card",
                    "company_pan_card",
                    "photo",
                    "signature",
                  ].map((docType) => (
                    <div key={docType}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {docType.replace("_", " ").toUpperCase()}{" "}
                        {[
                          "aadhar_card",
                          "pan_card",
                          "company_pan_card",
                          "photo",
                        ].includes(docType)
                          ? "*"
                          : ""}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept={
                            docType === "signature"
                              ? "image/*"
                              : "image/*,application/pdf"
                          }
                          onChange={(e) => handleFileChange(e, docType)}
                          className="hidden"
                          id={docType}
                        />
                        <label htmlFor={docType} className="cursor-pointer">
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Click to upload {docType.replace("_", " ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 5MB
                          </p>
                        </label>
                        {preview[docType] && (
                          <img
                            src={preview[docType]}
                            alt={`${docType} preview`}
                            className="mt-2 h-20 mx-auto object-cover rounded"
                          />
                        )}
                        {formData[docType] && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData[docType].name}
                          </p>
                        )}
                      </div>
                      {errors[docType] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[docType]}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Business Document Uploads */}
                  {["business_license", "gst_certificate"].map((docType) => (
                    <div key={docType}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {docType.replace("_", " ").toUpperCase()}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileChange(e, docType)}
                          className="hidden"
                          id={docType}
                        />
                        <label htmlFor={docType} className="cursor-pointer">
                          <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Click to upload {docType.replace("_", " ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 5MB
                          </p>
                        </label>
                        {preview[docType] && (
                          <img
                            src={preview[docType]}
                            alt={`${docType} preview`}
                            className="mt-2 h-20 mx-auto object-cover rounded"
                          />
                        )}
                        {formData[docType] && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ {formData[docType].name}
                          </p>
                        )}
                      </div>
                      {errors[docType] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[docType]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Important Guidelines:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ensure all documents are clear and readable</li>
                    <li>• Upload original documents, not photocopies</li>
                    <li>• Make sure document numbers match exactly</li>
                    <li>• Business documents should be current and valid</li>
                    <li>• All information will be verified</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={step === 1}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit KYC Application"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYCSubmission;
