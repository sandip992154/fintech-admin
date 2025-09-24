import React, { useState, useEffect } from "react";
import {
  FiLock,
  FiUnlock,
  FiRefreshCw,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import MPINManagementService from "../services/mpinManagementService";

const MPINManagement = () => {
  const [mpinStats, setMpinStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [userMpinStatus, setUserMpinStatus] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [setupData, setSetupData] = useState({
    mpin: "",
    confirm_mpin: "",
  });

  const [changeData, setChangeData] = useState({
    old_mpin: "",
    new_mpin: "",
    confirm_new_mpin: "",
  });

  const [resetData, setResetData] = useState({
    otp: "",
    new_mpin: "",
    confirm_new_mpin: "",
    reset_token: "",
  });

  const [resetStep, setResetStep] = useState(1); // 1: request, 2: verify OTP, 3: set new MPIN

  useEffect(() => {
    fetchMPINData();
  }, []);

  const fetchMPINData = async () => {
    try {
      setLoading(true);
      const [statsResponse, statusResponse] = await Promise.all([
        MPINManagementService.getMPINStats(),
        MPINManagementService.getMPINStatus(),
      ]);

      setMpinStats(statsResponse.data || {});
      setUserMpinStatus(statusResponse.data || {});
    } catch (error) {
      console.error("Error fetching MPIN data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupMPIN = async (e) => {
    e.preventDefault();

    if (setupData.mpin !== setupData.confirm_mpin) {
      alert("MPIN and confirmation do not match");
      return;
    }

    if (setupData.mpin.length < 4 || setupData.mpin.length > 6) {
      alert("MPIN must be 4-6 digits");
      return;
    }

    try {
      await MPINManagementService.setupMPIN({ mpin: setupData.mpin });

      setSetupData({ mpin: "", confirm_mpin: "" });
      setShowSetupModal(false);
      fetchMPINData(); // Refresh data
      alert("MPIN setup successfully!");
    } catch (error) {
      console.error("Error setting up MPIN:", error);
      alert("Failed to setup MPIN");
    }
  };

  const handleChangeMPIN = async (e) => {
    e.preventDefault();

    if (changeData.new_mpin !== changeData.confirm_new_mpin) {
      alert("New MPIN and confirmation do not match");
      return;
    }

    try {
      await MPINManagementService.changeMPIN(
        changeData.old_mpin,
        changeData.new_mpin
      );

      setChangeData({ old_mpin: "", new_mpin: "", confirm_new_mpin: "" });
      setShowChangeModal(false);
      fetchMPINData(); // Refresh data
      alert("MPIN changed successfully!");
    } catch (error) {
      console.error("Error changing MPIN:", error);
      alert("Failed to change MPIN. Please check your old MPIN.");
    }
  };

  const handleRequestReset = async () => {
    try {
      const response = await MPINManagementService.requestMPINReset();
      alert("OTP sent to your email. Please check your inbox.");
      setResetStep(2);
    } catch (error) {
      console.error("Error requesting MPIN reset:", error);
      alert("Failed to send reset OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await MPINManagementService.verifyResetOTP(
        resetData.otp
      );
      setResetData({ ...resetData, reset_token: response.data.reset_token });
      setResetStep(3);
      alert("OTP verified successfully. Please set your new MPIN.");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleResetMPIN = async (e) => {
    e.preventDefault();

    if (resetData.new_mpin !== resetData.confirm_new_mpin) {
      alert("New MPIN and confirmation do not match");
      return;
    }

    try {
      await MPINManagementService.resetMPIN(
        resetData.reset_token,
        resetData.new_mpin
      );

      setResetData({
        otp: "",
        new_mpin: "",
        confirm_new_mpin: "",
        reset_token: "",
      });
      setResetStep(1);
      setShowResetModal(false);
      fetchMPINData(); // Refresh data
      alert("MPIN reset successfully!");
    } catch (error) {
      console.error("Error resetting MPIN:", error);
      alert("Failed to reset MPIN");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "text-green-600 bg-green-100",
      locked: "text-red-600 bg-red-100",
      expired: "text-yellow-600 bg-yellow-100",
      not_set: "text-gray-600 bg-gray-100",
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          MPIN Management
        </h1>
        <p className="text-gray-600">
          Manage your Mobile PIN for secure transactions
        </p>
      </div>

      {/* User MPIN Status Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your MPIN Status
            </h2>
            {userMpinStatus && (
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                    userMpinStatus.status
                  )}`}
                >
                  {userMpinStatus.status?.replace("_", " ").toUpperCase()}
                </span>
                {userMpinStatus.last_updated && (
                  <span className="text-sm text-gray-500">
                    Last updated:{" "}
                    {new Date(userMpinStatus.last_updated).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            {!userMpinStatus?.is_set ? (
              <button
                onClick={() => setShowSetupModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FiLock className="mr-2" />
                Setup MPIN
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowChangeModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
                >
                  <FiRefreshCw className="mr-2" />
                  Change MPIN
                </button>
                <button
                  onClick={() => setShowResetModal(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
                >
                  <FiUnlock className="mr-2" />
                  Reset MPIN
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MPIN Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FiUsers className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {mpinStats.total_users || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FiCheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">MPIN Set</p>
              <p className="text-2xl font-bold text-gray-900">
                {mpinStats.mpin_set || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FiXCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Locked</p>
              <p className="text-2xl font-bold text-gray-900">
                {mpinStats.locked || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FiClock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-2xl font-bold text-gray-900">
                {mpinStats.expired || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Guidelines */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          MPIN Security Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Use a unique 4-6 digit MPIN</li>
              <li>• Don't use sequential numbers (1234, 5678)</li>
              <li>• Don't use your birth date or phone number</li>
              <li>• Change your MPIN regularly</li>
              <li>• Never share your MPIN with anyone</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Security Features
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• MPIN is encrypted and secure</li>
              <li>• Account locks after 3 failed attempts</li>
              <li>• Email notifications for MPIN changes</li>
              <li>• 90-day expiry for enhanced security</li>
              <li>• OTP verification for reset</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Setup MPIN Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Setup MPIN
                </h3>
                <button
                  onClick={() => setShowSetupModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSetupMPIN} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter MPIN (4-6 digits)
                  </label>
                  <input
                    type="password"
                    required
                    maxLength="6"
                    pattern="[0-9]{4,6}"
                    value={setupData.mpin}
                    onChange={(e) =>
                      setSetupData({ ...setupData, mpin: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                    placeholder="••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm MPIN
                  </label>
                  <input
                    type="password"
                    required
                    maxLength="6"
                    pattern="[0-9]{4,6}"
                    value={setupData.confirm_mpin}
                    onChange={(e) =>
                      setSetupData({
                        ...setupData,
                        confirm_mpin: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                    placeholder="••••"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSetupModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Setup MPIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change MPIN Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Change MPIN
                </h3>
                <button
                  onClick={() => setShowChangeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleChangeMPIN} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current MPIN
                  </label>
                  <input
                    type="password"
                    required
                    maxLength="6"
                    value={changeData.old_mpin}
                    onChange={(e) =>
                      setChangeData({ ...changeData, old_mpin: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                    placeholder="••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New MPIN (4-6 digits)
                  </label>
                  <input
                    type="password"
                    required
                    maxLength="6"
                    pattern="[0-9]{4,6}"
                    value={changeData.new_mpin}
                    onChange={(e) =>
                      setChangeData({ ...changeData, new_mpin: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                    placeholder="••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New MPIN
                  </label>
                  <input
                    type="password"
                    required
                    maxLength="6"
                    pattern="[0-9]{4,6}"
                    value={changeData.confirm_new_mpin}
                    onChange={(e) =>
                      setChangeData({
                        ...changeData,
                        confirm_new_mpin: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                    placeholder="••••"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowChangeModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Change MPIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reset MPIN Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Reset MPIN
                </h3>
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setResetStep(1);
                    setResetData({
                      otp: "",
                      new_mpin: "",
                      confirm_new_mpin: "",
                      reset_token: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {resetStep === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    An OTP will be sent to your registered email address for
                    verification.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowResetModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRequestReset}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
              )}

              {resetStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={resetData.otp}
                      onChange={(e) =>
                        setResetData({ ...resetData, otp: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-widest"
                      placeholder="000000"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setResetStep(1)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleVerifyOTP}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              )}

              {resetStep === 3 && (
                <form onSubmit={handleResetMPIN} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New MPIN (4-6 digits)
                    </label>
                    <input
                      type="password"
                      required
                      maxLength="6"
                      pattern="[0-9]{4,6}"
                      value={resetData.new_mpin}
                      onChange={(e) =>
                        setResetData({ ...resetData, new_mpin: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                      placeholder="••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New MPIN
                    </label>
                    <input
                      type="password"
                      required
                      maxLength="6"
                      pattern="[0-9]{4,6}"
                      value={resetData.confirm_new_mpin}
                      onChange={(e) =>
                        setResetData({
                          ...resetData,
                          confirm_new_mpin: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                      placeholder="••••"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setResetStep(2)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reset MPIN
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MPINManagement;
