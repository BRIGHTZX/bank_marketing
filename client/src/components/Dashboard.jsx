import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BarChart from "./chartjs/BarChart";
import PieChart from "./chartjs/PieChart";
import LineChart from "./chartjs/LineChart";

function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const res = await axios.get("api/bank/getDatas");
        const data = res.data;
        if (res.status >= 200 && res.status < 300) {
          setDatas(data.bankDatas);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatas();
  }, [currentUser.id]);

  return (
    <main>
      {loading ? (
        <div>loading</div>
      ) : (
        <div className="grid grid-cols-4 grid-rows-4">
          <section className="col-span-2  border">
            <h1 className="text-5xl font-bold">JOB</h1>
            <BarChart data={datas} category="job" />
          </section>
          <section className="col-span-1 border">
            <h1 className="text-5xl font-bold">JOB</h1>
            <BarChart data={datas} category="marital" className="row-span-1" />
            <PieChart data={datas} category="marital" className="row-span-1" />
          </section>
          <section className="col-span-4 border">
            <h1 className="text-5xl font-bold">JOB</h1>
            <LineChart data={datas} category={"balance"} />
          </section>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
