import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LogarithmicScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LogarithmicScale
);

const monthMap = {
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
};

const MixedChart = ({
  data,
  category,
  label,
  xLabel,
  yLeft,
  yRight,
  description,
}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No Data Available</p>;
  }
  const eachData = data.reduce((acc, current) => {
    const key = current[category[0]];
    const balance = current[category[1]];

    if (!acc[key]) {
      acc[key] = { totalBalance: 0, count: 0 };
    }

    acc[key].totalBalance += balance;
    acc[key].count += 1;

    return acc;
  }, {});

  let labels = Object.keys(eachData);
  const barData = labels.map((key) => eachData[key]?.count || 0);
  const lineData = labels.map((key) => {
    if (category[0] === "age") {
      return eachData[key].totalBalance / eachData[key].count || 0; // ค่าเฉลี่ยยอดเงิน
    }
    return eachData[key]?.totalBalance || 0; // ยอดเงินรวมถ้าเป็นเดือน
  });

  // แปลงเดือนเป็นชื่อเดือนถ้าหาก category[0] เป็น 'month'
  if (category[0] === "month") {
    labels = labels.map((month) => monthMap[month]);
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: label[0],
        data: barData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        type: "bar",
        yAxisID: "y-bar",
      },
      {
        label: label[1],
        data: lineData,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: false,
        type: "line",
        yAxisID: "y-line",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: description,
      },
    },
    scales: {
      "y-line": {
        beginAtZero: true,
        type: "linear",
        position: "left",
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: yLeft,
        },
      },
      "y-bar": {
        beginAtZero: true,
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: yRight,
        },
      },
      x: {
        title: {
          display: true,
          text: xLabel,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default MixedChart;
