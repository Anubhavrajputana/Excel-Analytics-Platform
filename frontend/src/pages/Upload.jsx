import React, { useState } from "react";
import UploadCard from "../components/UploadCard";
import "./Upload.css"; // custom background CSS here

const Upload = () => {
  const [parsedData, setParsedData] = useState([]);

  const handleDataParsed = (data) => {
    setParsedData(data);
  };

  return (
    <div className="upload-bg position-relative text-white" style={{ minHeight: "100vh", padding: "2rem" }}>
      {/* Floating Icons */}
      <div className="floating-icons">
        <img src="/icons/excel.png" className="float-icon icon1" alt="excel" />
        <img src="/icons/upload.png" className="float-icon icon2" alt="upload" />
        <img src="/icons/table.png" className="float-icon icon3" alt="table" />
        <img src="/icons/chart.png" className="float-icon icon4" alt="chart" />
      </div>

      {/* Upload Container */}
      <div className="container-fluid bg-dark bg-opacity-50 p-4 rounded-4 shadow-lg border border-light">
        <h2 className="fw-bold text-warning mb-4 text-center">📤 Upload Excel File</h2>

        <UploadCard onDataParsed={handleDataParsed} />

        {parsedData.length > 0 && (
          <div className="card shadow-sm mt-4">
            <div className="card-body bg-light text-dark rounded-3">
              <h5 className="card-title text-success fw-bold mb-3">✅ Parsed Excel Data</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-sm">
                  <thead className="table-light">
                    <tr>
                      {Object.keys(parsedData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((cell, colIndex) => (
                          <td key={colIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
