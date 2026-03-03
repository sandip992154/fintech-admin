import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import walletService from "../services/walletService";

export default function LoadWalletModal({ onClose }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!user?.id) {
      setError("User session not found. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const result = await walletService.requestFundLoad(user.id, amount, remark);
      if (result.success) {
        setSuccess(result.message || "Fund load request submitted successfully!");
        setAmount("");
        setRemark("");
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setError(result.message || "Failed to submit request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="rounded-lg w-96 ">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">Load Wallet</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              &times;
            </button>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mx-6 mb-2 px-3 py-2 rounded bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mx-6 mb-2 px-3 py-2 rounded bg-green-100 text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form className="flex flex-col gap-4 px-6 py-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm">Amount</label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-1"
              placeholder="Enter amount"
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Remark</label>
            <textarea
              rows="3"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-1"
              placeholder="Enter remark (optional)"
              disabled={loading}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white py-2 rounded mt-4 font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
