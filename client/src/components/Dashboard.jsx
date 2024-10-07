import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BarChart from "./chartjs/BarChart";
import PieChart from "./chartjs/PieChart";
import LineChart from "./chartjs/LineChart";
import BarCompareChart from "./chartjs/BarCompareChart";
import { BsCashStack } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const location = useLocation();

  const { currentUser } = useSelector((state) => state.user);
  const [datas, setDatas] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [serchForm, setSearchForm] = useState({
    sort: "asc",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const res = await axios.get("api/bank/getDatas");
        const data = res.data;
        if (res.status >= 200 && res.status < 300) {
          setDatas(data.bankDatas);
          setTotalUsers(data.totalDatas);

          const totalBalance = data.bankDatas.reduce((acc, current) => {
            return acc + current.balance;
          }, 0);

          const formattedBalance = totalBalance.toLocaleString();

          setTotalBalance(formattedBalance);
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
        <div className="grid grid-cols-5 gap-1">
          {/* Section All Data */}
          <section className="col-span-3 h-[180px] p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-[150px] shadow-md border rounded-tl-3xl rounded-br-3xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold">Total Users</h3>
                  <FaUser className="text-3xl mr-4" />
                </div>
                <p className="text-3xl mt-4 font-bold">
                  {totalUsers} <span className="text-xl">User</span>
                </p>
              </div>
              <div className="h-[150px] shadow-md border rounded-tl-3xl rounded-br-3xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold">Total Balance</h3>
                  <BsCashStack className="text-4xl mr-4" />
                </div>
                <p className="text-3xl font-bold mt-4"> € {totalBalance}</p>
              </div>
            </div>
            {/*  */}
            <div className="shadow-md border mt-4 rounded-xl">
              <div className="p-4 ">
                <h1 className="text-5xl font-bold">JOB</h1>
                <BarChart data={datas} category="job" />
              </div>
            </div>
            {/*  */}
            <div className="shadow-md border mt-4 rounded-xl">
              <h1 className="text-5xl font-bold">Age</h1>
              <BarChart data={datas} category="age" />
            </div>
          </section>
          {/* Section 1: JOB */}

          {/* Section 2: Marital */}
          <section className="col-span-2 grid grid-cols-2 pr-4">
            <section className="col-span-2 h-[180px] p-4">
              <form >
                <select onValueChange={()}>
                  <option value="asc">less</option>
                  <option value="desc">more</option>
                </select>
              </form>
            </section>
            {/* Marital Section */}
            <section className="p-2 shadow-md border rounded-xl mr-4">
              <div className="h-full w-full text-center">
                <h1 className="text-5xl font-bold my-4">Marital</h1>
                <div className="h-3/4 flex items-center justify-center">
                  <PieChart data={datas} category="marital" />
                </div>
              </div>
            </section>

            {/* Housing Section */}
            <section className="p-2 shadow-md border rounded-xl">
              <div className="h-full w-full text-center">
                <h1 className="text-5xl font-bold my-4">Housing</h1>
                <div className="h-3/4 flex items-center justify-center">
                  <PieChart data={datas} category="housing" />
                </div>
              </div>
            </section>

            <section className="col-span-2  p-2 shadow-md border rounded-xl mt-4">
              <div className="h-full w-full text-center">
                <h1 className="text-5xl font-bold my-4">job - balance</h1>
                <BarCompareChart data={datas} />
              </div>
            </section>

            <section className="col-span-2  p-2 shadow-md border rounded-xl mt-4">
              <div className="h-full w-full text-center">
                <h1 className="text-5xl font-bold my-4">age-balance</h1>
                <LineChart data={datas} />
              </div>
            </section>
          </section>

          <section className="col-span-5">asdfasdf</section>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
