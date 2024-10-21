import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

function LineChart({ data, description }) {
  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }

  // ใช้ reduce เพื่อรวม balance ตาม age
  const ageBalanceMap = data.reduce((acc, current) => {
    const age = current.age;
    const balance = current.balance;

    if (!acc[age]) {
      acc[age] = { totalBalance: 0, count: 0 };
    }
    acc[age].totalBalance += balance;
    acc[age].count += 1;
    return acc;
  }, {});

  const labels = Object.keys(ageBalanceMap);
  const dataset = labels.map(
    (age) => ageBalanceMap[age].totalBalance / ageBalanceMap[age].count
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "ค่าเฉลี่ย Balance ตามอายุ",
        data: dataset,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        fill: true, // ถ้าต้องการให้มีการเติมสีใต้กราฟ
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
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart;
