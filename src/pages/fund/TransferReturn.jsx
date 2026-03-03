import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import walletService from "../../services/walletService";
import PaginatedTable from "../../components/utility/PaginatedTable";
import ExcelExportButton from "../../components/utility/ExcelExportButton";
import { toast } from "react-toastify";

export const TransferReturn = () => {
  const { user } = useAuth();

  // ── Transfer Form State ──────────────────────────────────────
  const [form, setForm] = useState({ toUserId: "", amount: "", remark: "" });
  const [submitting, setSubmitting] = useState(false);

  // ── History State ────────────────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // ── Fetch transfer history ───────────────────────────────────
  const fetchHistory = useCallback(async (page = 1) => {
    if (!user?.id) return;
    setLoadingHistory(true);
    const offset = (page - 1) * pageSize;
    const result = await walletService.getMyTransactions(pageSize, offset);
    if (result.success) {
      const allTxns = result.data?.transactions || [];
      // Show only fund transfers (TXF- prefix)
      const transfers = allTxns.filter(
        (t) => t.reference_id && t.reference_id.startsWith("TXF-")
      );
      setTransactions(transfers);
      setTotalCount(result.data?.total_count || 0);
    }
    setLoadingHistory(false);
  }, [user?.id]);

  useEffect(() => {
    fetchHistory(currentPage);
  }, [fetchHistory, currentPage]);

  // ── Handle Transfer Submit ───────────────────────────────────
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!user?.id) { toast.error("User session not found."); return; }
    if (!form.toUserId || Number(form.toUserId) <= 0) {
      toast.error("Please enter a valid recipient user ID."); return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid amount greater than 0."); return;
    }
    if (Number(form.toUserId) === user.id) {
      toast.error("You cannot transfer to yourself."); return;
    }

    setSubmitting(true);
    const result = await walletService.transferFunds(
      user.id,
      Number(form.toUserId),
      Number(form.amount),
      form.remark
    );

    if (result.success) {
      toast.success(result.message || "Transfer successful!");
      setForm({ toUserId: "", amount: "", remark: "" });
      fetchHistory(1);
      setCurrentPage(1);
    } else {
      toast.error(result.message || "Transfer failed.");
    }
    setSubmitting(false);
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

  const formatAmt = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount ?? 0);

  // ── Table Columns ────────────────────────────────────────────
  const columns = [
    {
      header: "#",
      accessor: "id",
      render: (row, idx) => (currentPage - 1) * pageSize + idx + 1,
    },
    {
      header: "Date & Time",
      accessor: "created_at",
      render: (row) => <span className="whitespace-nowrap">{formatDate(row.created_at)}</span>,
    },
    {
      header: "Reference ID",
      accessor: "reference_id",
      render: (row) => <span className="font-mono text-xs">{row.reference_id || "—"}</span>,
    },
    {
      header: "Type",
      accessor: "transaction_type",
      render: (row) => {
        const t = (row.transaction_type || "").toLowerCase();
        return (
          <span className={`px-2 py-1 rounded text-xs font-semibold ${t === "credit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {t === "credit" ? "Received" : "Sent"}
          </span>
        );
      },
    },
    {
      header: "Remark",
      accessor: "remark",
      render: (row) => <span className="text-xs">{row.remark || "—"}</span>,
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span className={(row.transaction_type || "").toLowerCase() === "debit" ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
          {formatAmt(row.amount)}
        </span>
      ),
    },
    {
      header: "Balance After",
      accessor: "balance_after",
      render: (row) => formatAmt(row.balance_after),
    },
  ];

  const handleExport = () =>
    transactions.map((t, i) => ({
      "#": i + 1,
      "Date & Time": formatDate(t.created_at),
      "Reference ID": t.reference_id || "N/A",
      Type: (t.transaction_type || "").toLowerCase() === "credit" ? "Received" : "Sent",
      Remark: t.remark || "N/A",
      Amount: t.amount ?? 0,
      "Balance After": t.balance_after ?? 0,
    }));

  return (
    <div className="h-[90vh] 2xl:max-w-[80%] p-4 mx-8 bg-secondaryOne dark:bg-darkBlue/70 rounded-2xl 2xl:mx-auto text-gray-800 overflow-hidden overflow-y-auto px-4 pb-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">

      {/* ── Transfer Form ── */}
      <div className="my-4 p-5 rounded-md bg-white dark:bg-cardOffWhite shadow">
        <h2 className="text-xl font-bold dark:text-adminOffWhite mb-4">Fund Transfer</h2>
        <form onSubmit={handleTransfer} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Recipient User ID <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="1"
              value={form.toUserId}
              onChange={(e) => setForm((p) => ({ ...p, toUserId: e.target.value }))}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              placeholder="Enter recipient user ID"
              disabled={submitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹) <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              placeholder="Enter amount"
              disabled={submitting}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Remark (optional)</label>
            <input
              type="text"
              value={form.remark}
              onChange={(e) => setForm((p) => ({ ...p, remark: e.target.value }))}
              className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm"
              placeholder="Enter remark"
              disabled={submitting}
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-8 py-2 rounded font-semibold text-sm hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Transferring..." : "Transfer Funds"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Transfer History ── */}
      <div className="mt-4 p-4 rounded-md bg-white dark:bg-transparent">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold dark:text-adminOffWhite">Transfer History</h2>
          <div className="flex gap-2">
            <button
              onClick={() => fetchHistory(currentPage)}
              disabled={loadingHistory}
              className="btn-24 text-adminOffWhite bg-accentRed disabled:opacity-60"
            >
              {loadingHistory ? "Loading..." : "Refresh"}
            </button>
            <ExcelExportButton buttonLabel="Export" fileName="transfer-history.xlsx" data={handleExport()} />
          </div>
        </div>

        {loadingHistory ? (
          <div className="flex justify-center py-10 text-gray-500">Loading history...</div>
        ) : (
          <PaginatedTable
            data={transactions}
            columns={columns}
            currentPage={currentPage}
            setCurrentPage={(p) => { setCurrentPage(p); fetchHistory(p); }}
            pageSize={pageSize}
          />
        )}
      </div>
    </div>
  );
};
