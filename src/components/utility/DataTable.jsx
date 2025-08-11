export const DataTable = ({
  columns = [],
  data = [],
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalEntries,
  getPaginationRange,
}) => {
  return (
    <div className="p-6 rounded-md w-full bg-white dark:bg-transparent dark:text-white">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead>
            <tr className="bg-darkBlue/90 dark:bg-primaryBlue/30 text-white uppercase text-xs">
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-3">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-[#3F425D]">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No rows in the table
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-300">
        <p>
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalEntries)} to{" "}
          {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries}{" "}
          entries
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#1F2235] text-gray-500 rounded disabled:opacity-30"
          >
            ←
          </button>

          {getPaginationRange().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded ${
                currentPage === pageNum
                  ? "bg-secondary text-white"
                  : "bg-[#1F2235] text-gray-500"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-[#1F2235] text-gray-500 rounded disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};
