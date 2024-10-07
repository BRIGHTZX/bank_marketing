import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Import Filler
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register components ของ Chart.js รวมถึง Filler ด้วย
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register Filler
);
function BarChart({ data, category }) {
  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }

  const barCount = data.reduce((acc, current) => {
    acc[current[category]] = (acc[current[category]] || 0) + 1;
    return acc;
  }, {}); //{} = ค่าเริ่มต้น ให้เป็น object ป่าว

  const labels = Object.keys(barCount).map(
    (job) => job.charAt(0).toUpperCase() + job.slice(1).toLowerCase()
  );
  const dataset = Object.values(barCount);

  // กำหนดสีสำหรับแต่ละแท่ง
  const backgroundColors = [
    "rgba(75, 192, 192)", // แท่งที่ 1
    "rgba(255, 99, 132)", // แท่งที่ 2
    "rgba(54, 162, 235)", // แท่งที่ 3
    "rgba(255, 206, 86)", // แท่งที่ 4
    "rgba(153, 102, 255)", // แท่งที่ 5
    "rgba(255, 159, 64)", // แท่งที่ 6
  ];

  // กำหนดสีของแท่งให้แต่ละแท่งด้วยการใช้ backgroundColors
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

  return <Bar data={chartData} />;
}

export default BarChart;
