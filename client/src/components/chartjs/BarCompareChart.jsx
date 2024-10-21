import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register components ของ Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarCompareChart({
  data,
  category,
  option,
  xlabel,
  ylabel,
  barLabel,
  description,
  avg,
}) {
  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }

  const jobData = data.reduce((acc, current) => {
    const job = current[category[0]];
    const balance = current[category[1]];

    if (!acc[job]) {
      acc[job] = { totalBalance: 0, count: 0 };
    }

    acc[job].totalBalance += balance;
    acc[job].count += 1;

    return acc;
  }, {});

  let labels = Object.keys(jobData); // อาชีพต่างๆ
  const dataset = labels.map((job) => {
    if (avg === true) {
      return jobData[job].totalBalance / jobData[job].count; // Calculate average
    } else {
      return jobData[job].totalBalance; // Return total balance
    }
  });
  labels = labels.map((job) => job.charAt(0).toUpperCase() + job.slice(1));
  // กำหนดสีสำหรับแต่ละแท่ง
  const backgroundColors = [
    "rgba(75, 192, 192, 0.6)", // แท่งที่ 1
    "rgba(255, 99, 132, 0.6)", // แท่งที่ 2
    "rgba(54, 162, 235, 0.6)", // แท่งที่ 3
    "rgba(255, 206, 86, 0.6)", // แท่งที่ 4
    "rgba(153, 102, 255, 0.6)", // แท่งที่ 5
    "rgba(255, 159, 64, 0.6)", // แท่งที่ 6
  ];

  // กำหนดข้อมูลใน chartData
  const chartData = {
    labels: labels, // อาชีพต่างๆ
    datasets: [
      {
        label: barLabel,
        data: dataset, // ข้อมูล balance เฉลี่ยต่ออาชีพ
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

  const options = {
    indexAxis: option === "horizontal" ? "y" : "x", // เปลี่ยนแนวแกนตาม prop
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: description,
      },
    },

    scales: {
      x: {
        beginAtZero: true, // เริ่มที่ 0
        title: {
          display: true,
          text: xlabel,
        },
      },
      y: {
        title: {
          display: true,
          text: ylabel,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default BarCompareChart;
