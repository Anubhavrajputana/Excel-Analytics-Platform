import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const UploadCard = ({ onDataParsed }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !selectedFile.name.match(/\.(xls|xlsx)$/i)) {
      toast.error("Only .xls or .xlsx files are allowed.");
      return;
    }
    setFile(selectedFile);
  };

  const handleParse = () => {
    if (!file) return toast.error("Please select a file first");

    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        if (!workbook.SheetNames.length) {
          toast.error("No sheets found in the Excel file.");
          return;
        }

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);

        if (!json || json.length === 0) {
          toast.warning("Excel sheet is empty or invalid.");
          return;
        }

        console.log("✅ Parsed Excel JSON:", json);

        if (typeof onDataParsed === "function") {
          onDataParsed(json);
        }

        toast.success("Excel parsed successfully!");
      } catch (err) {
        console.error("❌ Excel parse error:", err);
        toast.error("Failed to parse the Excel file.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading the file.");
      setLoading(false);
    };

    reader.readAsArrayBuffer(file); // Correct method
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body">
  <h5 className="card-title text-warning fw-bold mb-4">📤 Upload Excel File</h5>

  <div className="mb-3">
    <input
      type="file"
      accept=".xls,.xlsx"
      onChange={handleFileChange}
      className="form-control border-2 border-success rounded-3 bg-white text-dark shadow-sm"
    />
  </div>

  <button
    onClick={handleParse}
    className="btn btn-success w-100 fw-semibold shadow-sm"
    disabled={loading}
    style={{
      background: "linear-gradient(90deg, #00c9a7, #005f73)",
      border: "none",
    }}
  >
    {loading ? "⏳ Parsing..." : "📥 Upload & Parse"}
  </button>
</div>

      </div>
    </div>
  );
};

export default UploadCard;
