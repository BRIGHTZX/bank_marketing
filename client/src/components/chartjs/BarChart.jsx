import React, { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

// Register components ของ Chart.js รวมถึง Filler ด้วย
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function BarChart({ data, category }) {
  const navigate = useNavigate();
  const chartRef = useRef(null); // สร้าง reference สำหรับ Chart

  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }

  const barCount = data.reduce((acc, current) => {
    acc[current[category]] = (acc[current[category]] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(barCount).map(
    (job) => job.charAt(0).toUpperCase() + job.slice(1).toLowerCase()
  );
  const dataset = Object.values(barCount);

  const backgroundColors = [
    "rgba(75, 192, 192)",
    "rgba(255, 99, 132)",
    "rgba(54, 162, 235)",
    "rgba(255, 206, 86)",
    "rgba(153, 102, 255)",
    "rgba(255, 159, 64)",
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "จำนวนคนต่ออาชีพ",
        data: dataset,
        backgroundColor: labels.map(
          (_, index) => backgroundColors[index % backgroundColors.length]
        ),
        borderColor: labels.map(
          (_, index) => backgroundColors[index % backgroundColors.length]
        ),
        borderWidth: 1,
      },
    ],
  };

  const handleClick = (event) => {
    const chart = chartRef.current; // เข้าถึง instance ของ Chart
    if (!chart) return;

    const elements = chart.getElementsAtEventForMode(
      event.nativeEvent,
      "nearest",
      { intersect: true },
      false
    );
    if (elements.length > 0) {
      const elementIndex = elements[0].index; // ดึง index ของแท่งที่ถูกคลิก
      const label = labels[elementIndex]; // ใช้ index เพื่อดึง label ของแท่ง
      console.log(`คลิกแท่ง: ${label}`); // แสดงผลใน console
      navigate(`/Dashboard?tab=detail&label=${label}`);
    }
  };

  return <Bar ref={chartRef} data={chartData} onClick={handleClick} />;
}

export default BarChart;
