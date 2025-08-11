export default function LoadWalletModal() {
  return (
    <div className="flex items-center justify-center ">
      <div className="  rounded-lg w-96 ">
        {/* Header */}
        <div className="flex justify-between items-center  px-4 py-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">Load Wallet</h2>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4 px-6 py-6">
          <div>
            <label className="block mb-1 text-sm">Amount</label>
            <input
              type="number"
              className="w-full px-3 py-2 rounded  border border-gray-600 focus:outline-none focus:ring-1"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Remark</label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 rounded  border border-gray-600 focus:outline-none focus:ring-1 "
              placeholder="Enter remark"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-2 rounded mt-4 font-medium cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
