import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function PieChart({ data, category }) {
  if (!data || data.length === 0) {
    return <p>No Data Available</p>;
  }
  const pieCount = data.reduce((acc, current) => {
    acc[current[category]] = (acc[current[category]] || 0) + 1;
    return acc;
  }, {}); //{} = ค่าเริ่มต้น ให้เป็น object ป่าว

  const labels = Object.keys(pieCount).map(
    (job) => job.charAt(0).toUpperCase() + job.slice(1).toLowerCase()
  );
  const dataset = Object.values(pieCount);

  // กำหนดสีสำหรับแต่ละแท่ง
  const backgroundColors = [
    "rgba(75, 192, 192)", // แท่งที่ 1
    "rgba(255, 99, 132)", // แท่งที่ 2
    "rgba(54, 162, 235)", // แท่งที่ 3
    "rgba(255, 206, 86)", // แท่งที่ 4
    "rgba(153, 102, 255)", // แท่งที่ 5
    "rgba(255, 159, 64)", // แท่งที่ 6
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "จำนวนคน ",
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

  return <Doughnut data={chartData} />;
}

export default PieChart;
