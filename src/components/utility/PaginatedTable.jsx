import { useEffect, useState } from "react";

const PaginatedTable = ({
  data = [],
  columns = [],
  filters = [],
  pageSize = 10,
  maxVisiblePages = 5,
  onSearch = () => {},
  currentPage = 1,
  setCurrentPage = () => {},
}) => {
  const [displayData, setDisplayData] = useState([]);

  useEffect(() => {
    const filtered = onSearch();
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    setDisplayData(data.slice(start, end));
  }, [data, currentPage, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  const getPaginationRange = () => {
    let start = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let end = start + maxVisiblePages - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisiblePages + 1, 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="p-6 rounded-md w-full bg-white dark:bg-transparent dark:text-white">
      {/* Table Wrapper with overflow fix */}
      <div className="relative overflow-x-auto">
        <table className="min-w-[1000px] w-full table-auto text-left text-sm">
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
            {displayData.length > 0 ? (
              displayData.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-2">
                      {col.render
                        ? col.render(row, rowIndex)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500 font-semibold w-full border-b-1 border-b-slate-400"
                >
                  No Rows Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-300 pt-2">
        <p>
          Showing {Math.min((currentPage - 1) * pageSize + 1, data.length)} to{" "}
          {Math.min(currentPage * pageSize, data.length)} of {data.length}{" "}
          entries
        </p>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#1F2235] text-gray-500 rounded disabled:opacity-30"
          >
            ←
          </button>

          {getPaginationRange().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
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

export default PaginatedTable;
