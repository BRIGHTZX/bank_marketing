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

function LineChart({ data, category }) {
  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }

  const age = ["10", "20", "40", "40", "50", "60", "70", "80", "90", "100"];

  const labels = age.map((age) => age);
  const dataset = data.map((item) => item.balance);
  // กำหนดสีสำหรับแต่ละแท่ง

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "จำนวนคนต่ออาชีพ",
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
        text: "My Line Chart",
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart;
