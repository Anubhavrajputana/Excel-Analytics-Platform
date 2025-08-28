import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadarController,
  PolarAreaController,
  DoughnutController,
  BubbleController,
  ScatterController,
  Filler,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";

// Register chart types and controllers
ChartJS.register(
  BarElement,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  RadarController,
  PolarAreaController,
  DoughnutController,
  BubbleController,
  ScatterController,
  Filler
);

const ChartViewer = ({ data }) => {
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState("bar");

  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  useEffect(() => {
    if (columns.length >= 2 && !xAxis && !yAxis) {
      setXAxis(columns[0]);
      setYAxis(columns[1]);
    }
  }, [columns]);

  useEffect(() => {
    if (!xAxis || !yAxis || !data) return;

    const xValues = data.map((row) => row[xAxis]);
    const yValues = data.map((row) => Number(row[yAxis]));

    setChartData({
      labels: xValues,
      datasets: [
        {
          label: `${yAxis} vs ${xAxis}`,
          data: yValues,
          backgroundColor: [
            "#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#e0e7ff",
            "#4ade80", "#facc15", "#f87171", "#60a5fa",
          ],
          borderColor: "#7c3aed",
          borderWidth: 1,
          fill: chartType === "line" || chartType === "area",
        },
      ],
    });
  }, [xAxis, yAxis, data, chartType]);

  const renderChart = () => {
    if (!chartData) return null;

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: "top" } },
      indexAxis: chartType === "horizontalBar" ? "y" : "x",
    };

    switch (chartType) {
      case "line":
      case "area":
        return <Line data={chartData} options={options} />;
      case "pie":
        return <Pie data={chartData} options={options} />;
      case "doughnut":
        return <Pie data={chartData} options={{ ...options, cutout: "70%" }} />;
      case "polarArea":
        return <Pie type="polarArea" data={chartData} options={options} />;
      case "radar":
        return <Line type="radar" data={chartData} options={options} />;
      case "bubble":
        const bubbleData = {
          datasets: data.map((row, i) => ({
            label: `Row ${i + 1}`,
            data: [{
              x: i + 1,
              y: Number(row[yAxis]),
              r: 5 + (Number(row[yAxis]) % 10),
            }],
            backgroundColor: "#8b5cf6",
          })),
        };
        return <Bar type="bubble" data={bubbleData} options={options} />;
      case "scatter":
        const scatterData = {
          datasets: [
            {
              label: "Scatter Dataset",
              data: data.map((row, i) => ({
                x: i + 1,
                y: Number(row[yAxis]),
              })),
              backgroundColor: "#10b981",
            },
          ],
        };
        return <Bar type="scatter" data={scatterData} options={options} />;
      case "horizontalBar":
        return <Bar data={chartData} options={options} />;
      case "bar":
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h4 className="card-title text-primary mb-4">📊 Chart Viewer</h4>

        {columns.length < 2 ? (
          <div className="alert alert-warning">
            Not enough columns to generate a chart.
          </div>
        ) : (
          <div className="row g-3 mb-4">
            {/* X-Axis Selector */}
            <div className="col-md-4">
              <label className="form-label">Select X-Axis:</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="form-select"
              >
                <option value="">-- Select --</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Y-Axis Selector */}
            <div className="col-md-4">
              <label className="form-label">Select Y-Axis:</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="form-select"
              >
                <option value="">-- Select --</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Chart Type Selector */}
            <div className="col-md-4">
              <label className="form-label">Chart Type:</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="form-select"
              >
                <option value="bar">Bar</option>
                <option value="horizontalBar">Horizontal Bar</option>
                <option value="line">Line</option>
                <option value="area">Area</option>
                <option value="pie">Pie</option>
                <option value="doughnut">Doughnut</option>
                <option value="polarArea">Polar Area</option>
                <option value="radar">Radar</option>
                <option value="bubble">Bubble</option>
                <option value="scatter">Scatter</option>
              </select>
            </div>
          </div>
        )}

        {chartData && (
          <div className="bg-light p-3 rounded shadow-sm" style={{ height: "400px" }}>
            {renderChart()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartViewer;
