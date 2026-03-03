/**
 * Wallet Service for Admin
 * Admin is a child of SuperAdmin - can view own wallet and request funds.
 * SuperAdmin handles topping up child wallets.
 */
import apiClient from "./apiClient";

class WalletService {
  /**
   * Get current user's wallet balance
   * GET /transactions/wallet/balance
   */
  async getMyWalletBalance() {
    try {
      const response = await apiClient.get("/transactions/wallet/balance");
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      if (error.response?.status === 404) {
        return {
          success: false,
          data: null,
          error: "wallet_not_found",
          message: "Wallet not found. Please contact your SuperAdmin to create one.",
        };
      }
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message,
        message: error.response?.data?.detail || "Failed to fetch wallet balance",
      };
    }
  }

  /**
   * Get wallet balance by user ID
   * GET /transactions/wallet/{userId}
   */
  async getWalletBalance(userId) {
    try {
      const response = await apiClient.get(`/transactions/wallet/${userId}`);
      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      if (error.response?.status === 404) {
        return {
          success: false,
          data: null,
          error: "wallet_not_found",
          message: "Wallet not found for this user.",
        };
      }
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message,
        message: error.response?.data?.detail || "Failed to fetch wallet balance",
      };
    }
  }

  /**
   * Create wallet for current user
   * POST /transactions/wallet/create
   */
  async createMyWallet() {
    try {
      const response = await apiClient.post("/transactions/wallet/create");
      return {
        success: true,
        data: response.data,
        error: null,
        message: "Wallet created successfully!",
      };
    } catch (error) {
      console.error("Error creating wallet:", error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message,
        message: error.response?.data?.detail || "Failed to create wallet",
      };
    }
  }

  /**
   * Get wallet transaction history for a user
   * GET /transactions/wallet/{userId}/transactions
   */
  async getWalletTransactions(userId, limit = 10, offset = 0) {
    try {
      const response = await apiClient.get(
        `/transactions/wallet/${userId}/transactions`,
        { params: { limit, offset } }
      );
      if (response.data && response.data.data) {
        return {
          success: true,
          data: {
            transactions: response.data.data.transactions || [],
            total_count: response.data.data.total_count || 0,
            wallet_balance: response.data.data.wallet_balance,
            wallet_id: response.data.data.wallet_id,
            limit: response.data.data.limit || limit,
            offset: response.data.data.offset || offset,
          },
          error: null,
        };
      }
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message,
        message: error.response?.data?.detail || "Failed to fetch transactions",
      };
    }
  }

  /**
   * Get full transaction history (with optional date range)
   * GET /transactions/history
   */
  async getTransactionHistory(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const response = await apiClient.get("/transactions/history", { params });
      return {
        success: true,
        data: response.data?.data || response.data || [],
        error: null,
      };
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      return {
        success: false,
        data: [],
        error: error.response?.data?.detail || error.message,
        message: error.response?.data?.detail || "Failed to fetch transaction history",
      };
    }
  }

  /**
   * Request a fund load (topup) for a given wallet user
   * POST /transactions/wallet/topup/{userId}
   */
  async requestFundLoad(userId, amount, remark = "") {
    try {
      const response = await apiClient.post(
        `/transactions/wallet/topup/${userId}`,
        { amount: Number(amount), remark }
      );
      return {
        success: true,
        data: response.data,
        error: null,
        message: response.data?.message || "Fund load request submitted successfully!",
      };
    } catch (error) {
      console.error("Error requesting fund load:", error);
      return {
        success: false,
        data: null,
        error: error.response?.data?.detail || error.message,
        message:
          error.response?.data?.detail ||
          "Failed to submit fund load request. Please contact your SuperAdmin.",
      };
    }
  }

  /**
   * Format balance for display in INR
   */
  formatBalance(balance) {
    if (balance === null || balance === undefined) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(balance);
  }
}

export default new WalletService();
