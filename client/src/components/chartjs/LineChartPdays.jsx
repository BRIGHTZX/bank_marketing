import { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

// Register components ของ Chart.js รวมถึง Filler ด้วย
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function LineChartPdays({ data, category }) {
  const navigate = useNavigate();
  const chartRef = useRef(null); // สร้าง reference สำหรับ Chart

  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }

  // Filter out data where the category value is -1
  const filteredData = data.filter((item) => item[category] !== -1);

  const barCount = filteredData.reduce((acc, current) => {
    acc[current[category]] = (acc[current[category]] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(barCount).map(
    (job) => job.charAt(0).toUpperCase() + job.slice(1).toLowerCase()
  );
  const dataset = Object.values(barCount);

  const borderColors = [
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
        fill: true,
        borderColor: borderColors[0], // สีเส้นกราฟ
        backgroundColor: "rgba(75, 192, 192, 0.2)", // พื้นหลังใต้เส้นกราฟ
        pointBackgroundColor: "rgba(75, 192, 192, 1)", // สีจุดในกราฟ
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4, // ความโค้งของเส้น
      },
    ],
  };

  return <Line ref={chartRef} data={chartData} />;
}

export default LineChartPdays;
