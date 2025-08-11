// components/ExcelExportButton.jsx
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

const ExcelExportButton = ({
  data = [],
  fileName = "export.xlsx",
  sheetName = "Sheet1",
  buttonLabel = "Export to Excel",
  className = "btn-24 text-adminOffWhite bg-accentGreen",
}) => {
  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast.success("No data available to export.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Set up headers
    worksheet.columns = Object.keys(data[0]).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1),
      key: key,
      width: 20,
    }));

    // Add rows
    data.forEach((row) => worksheet.addRow(row));

    // Bold header row
    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, fileName);
  };

  return (
    <button onClick={handleExport} className={className}>
      {buttonLabel}
    </button>
  );
};

export default ExcelExportButton;
