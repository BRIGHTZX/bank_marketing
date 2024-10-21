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
  LogarithmicScale // ลงทะเบียนสเกล logarithmic
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

const MixedChart = ({ data, category }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No Data Available</p>;
  }

  const eachMonthData = data.reduce((acc, current) => {
    if (!category || category.length < 2) {
      return acc;
    }

    const month = current[category[0]];
    const balance = current[category[1]];

    if (!acc[month]) {
      acc[month] = { totalBalance: 0, count: 0 };
    }

    acc[month].totalBalance += balance;
    acc[month].count += 1;

    return acc;
  }, {});

  let labels = Object.keys(eachMonthData);
  const barData = labels.map((month) => eachMonthData[month]?.count || 0);
  const lineData = labels.map(
    (month) => eachMonthData[month]?.totalBalance || 0
  );
  labels = labels.map((month) => monthMap[month]);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "จำนวนในแต่ละเดือน",
        data: barData,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        type: "bar",
        yAxisID: "y-bar",
      },
      {
        label: "ยอดเงินในแต่ละเดือน",
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
        text: "Mixed Chart Example",
      },
    },
    scales: {
      "y-line": {
        // สำหรับ line
        beginAtZero: true,
        type: "linear",
        position: "left",
        grid: {
          drawOnChartArea: false, // ไม่ให้แสดงกริดบนพื้นที่กราฟ
        },
      },
      "y-bar": {
        // สำหรับ bar
        beginAtZero: true,
        type: "linear",
        position: "right",
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default MixedChart;
