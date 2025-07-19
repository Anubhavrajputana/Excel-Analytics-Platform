// src/pages/Charts.jsx
import React, { useState } from "react";
import UploadCard from "../components/UploadCard";
import ChartViewer from "../components/ChartViewer";
import "../styles/ChartsBackground.css"; // background CSS

const Charts = () => {
  const [excelData, setExcelData] = useState([]);

  return (
    <div className="charts-page-wrapper">
      {/* Floating Icons Layer */}
      <div className="floating-icons">
        <img src="/icons/excel.png" className="float-icon icon1" alt="Excel" />
        <img src="/icons/chart.png" className="float-icon icon2" alt="Chart" />
        <img src="/icons/upload.png" className="float-icon icon3" alt="Upload" />
        <img src="/icons/data.png" className="float-icon icon4" alt="Data" />
      </div>

      {/* Main Content */}
      <div className="container-fluid bg-dark bg-opacity-50 p-4 rounded-4 shadow-lg border border-light">
        <h2 className="fw-bold text-warning mb-4 text-center">
          📈 Excel Chart Generator
        </h2>

        <div className="mb-5">
          <UploadCard onDataParsed={setExcelData} />
        </div>

        {excelData.length > 0 && (
          <div className="mt-5">
            <ChartViewer data={excelData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Charts;
