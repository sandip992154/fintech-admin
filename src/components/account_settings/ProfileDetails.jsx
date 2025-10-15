import { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../services/apiClient";

const ProfileDetails = ({
  initialData,
  onSubmit,
  loading = false,
  error = null,
}) => {
  const [formData, setFormData] = useState(initialData || {});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post(
        "/api/v1/profile/upload-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;
      setFormData((prev) => ({
        ...prev,
        profilePhoto: result.data.profile_photo,
      }));
      toast.success("Profile photo uploaded successfully");
    } catch (error) {
      console.error("Error uploading photo:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "Failed to upload photo";
      toast.error(errorMessage);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl">
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Profile Photo Section */}
      <div className="mb-6">
        <label className="block text-sm mb-2">Profile Photo</label>
        <div className="flex items-center space-x-4">
          {formData.profile_photo && (
            <div className="relative">
              <img
                src={formData.profile_photo}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              {uploadingPhoto ? "Uploading..." : "JPG, PNG, GIF up to 5MB"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">State</label>
          <input
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">PIN Code</label>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded border border-gray-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Gender</label>
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-600"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-600"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Security PIN (Optional)</label>
        <input
          type="password"
          name="securityPin"
          value={formData.securityPin || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded border border-gray-600"
          placeholder="Enter 4-digit PIN (leave empty if not set)"
        />
        <p className="text-xs text-gray-500 mt-1">
          Only required if you have set up an MPIN (exactly 4 digits)
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-secondary text-white py-2 px-6 rounded hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default ProfileDetails;
