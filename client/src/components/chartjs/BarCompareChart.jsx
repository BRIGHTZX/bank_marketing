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

function BarCompareChart({ data, category, option }) {
  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }

  // จัดกลุ่มตามอาชีพ (job) และคำนวณ balance เฉลี่ยของแต่ละอาชีพ
  const jobData = data.reduce((acc, current) => {
    const job = current[category[0]];
    const balance = current[category[1]];

    // ตรวจสอบว่ามี key อาชีพใน object สะสมหรือยัง
    if (!acc[job]) {
      acc[job] = { totalBalance: 0, count: 0 };
    }

    // บวกค่า balance เข้ากับค่า balance เดิม และนับจำนวนคนต่ออาชีพ
    acc[job].totalBalance += balance;
    acc[job].count += 1;

    return acc;
  }, {}); // {} = ค่าเริ่มต้น เป็น object เปล่า

  // คำนวณค่าเฉลี่ยต่ออาชีพ
  const labels = Object.keys(jobData); // อาชีพต่างๆ
  const dataset = labels.map(
    (job) => jobData[job].totalBalance / jobData[job].count
  ); // ค่าเฉลี่ย

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
        label: "ยอดเงินเฉลี่ยต่ออาชีพ",
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
    scales: {
      x: {
        beginAtZero: true, // เริ่มที่ 0
      },
      y: {
        title: {
          display: true,
          text: category[0] === "age" ? "อายุ" : "อาชีพ", // ชื่อแกน Y ขึ้นอยู่กับ category
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default BarCompareChart;
