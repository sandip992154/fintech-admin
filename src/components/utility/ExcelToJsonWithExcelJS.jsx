import React, { useEffect, useRef, useState } from "react";
import ExcelJS from "exceljs";
import { BiUpload, BiDownload } from "react-icons/bi";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

const ExcelToJsonWithExcelJS = ({
  requiredColumns = [],
  setSelectedCommission,
  provider = [],
}) => {
  const [jsonData, setJsonData] = useState([]);
  const fileInputRef = useRef();

  useEffect(() => {
    jsonData.length > 0 && setSelectedCommission(jsonData);
  }, [jsonData]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const buffer = event.target.result;
        await workbook.xlsx.load(buffer);

        const worksheet = workbook.worksheets[0];
        const rows = [];

        const headerRow = worksheet.getRow(1);
        const headers = headerRow.values.slice(1);

        const missingColumns = requiredColumns.filter(
          (col) => !headers.includes(col)
        );

        if (missingColumns.length > 0) {
          toast.error(
            `Missing required column(s): ${missingColumns.join(", ")}.`
          );
          setJsonData([]);
          return;
        }

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber === 1) return;
          const rowData = {};
          headers.forEach((header, colIndex) => {
            rowData[header] = row.getCell(colIndex + 1).value;
          });
          rows.push(rowData);
        });

        setJsonData(rows);
        toast.success("Excel data imported successfully!");
        // console.log("Parsed JSON:", rows);
      } catch (error) {
        toast.error("Failed to read Excel file.");
        // console.error("Excel parsing error:", error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const downloadTemplate = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Commission Structure");

      // Headers
      const headers = [
        "provider",
        "type",
        "whitelable",
        "md",
        "distributor",
        "retailer",
      ];
      worksheet.addRow(headers);

      const data = provider.map((row) => [row, , , , ,]);

      // Data Rows
      //   const data = [
      //     ["BSNL TOPUP", "Percent", 3.5, 3, 2.5, 2],
      //     ["BSNL VALIDITY", "Percent", 3.5, 3, 2.5, 2],
      //     ["JIORECH", "Percent", 0.8, 0.7, 0.6, 0.5],
      //     ["VI", "Percent", 3.5, 3, 2.5, 2],
      //     ["AIRTEL", "Percent", 0.8, 0.7, 0.6, 0.5],
      //   ];
      data.forEach((row) => worksheet.addRow(row));

      // Add dropdown (Data Validation) in column B (TYPE)
      for (let i = 2; i <= data.length + 1; i++) {
        worksheet.getCell(`B${i}`).dataValidation = {
          type: "list",
          allowBlank: false,
          formulae: ['"Percent,Flat"'],
        };
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "commission_structure.xlsx");
    } catch (error) {
      toast.error("Failed to generate template.");
      console.error("Excel generation error:", error);
    }
  };

  return (
    <div className="p-4 space-y-4 flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0">
      <button
        onClick={triggerFileSelect}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md shadow-md transition-all duration-200"
      >
        <BiUpload className="text-xl" />
        Import
      </button>

      <button
        onClick={downloadTemplate}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md shadow-md transition-all duration-200"
      >
        <BiDownload className="text-xl" />
        Template
      </button>

      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default ExcelToJsonWithExcelJS;
