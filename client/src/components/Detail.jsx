import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsCashStack } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import PieChart from "./chartjs/PieChart";
import LineChartPdays from "./chartjs/LineChartPdays";
import LineChart from "./chartjs/LineChart";
import BarChart from "./chartjs/BarChart";

function Detail() {
  const navigate = useNavigate();
  const [HeaderDetail, setHeaderDetail] = useState();

  const [totalUsers, setTotalUsers] = useState(null); // สร้าง state สำหรับเก็บข้อมูล
  const [totalBalance, setTotalBalance] = useState(null);
  const [datas, setDatas] = useState(null); // สร้าง state สำหรับเก็บข้อมูล
  const [loading, setLoading] = useState(true); // สถานะการโหลด
  const [error, setError] = useState(null); // สถานะข้อผิดพลาด
  const location = useLocation(); // ใช้ useLocation เพื่อเข้าถึง URL
  console.log(datas);

  useEffect(() => {
    // ดึง label จาก URL
    const urlParams = new URLSearchParams(location.search);
    const HeaderJob = urlParams.get("label");
    setHeaderDetail(HeaderJob);
    // ฟังก์ชัน fetch ข้อมูล
    const fetchData = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        console.log(searchQuery);
        const res = await axios.get(`api/bank/getDetails?${searchQuery}`);

        if (res.status >= 200 && res.status < 300) {
          const data = res.data;
          setTotalUsers(data.totalDatas);
          setDatas(data.bankDatas);

          const totalBalance = data.bankDatas.reduce((acc, current) => {
            return acc + current.balance;
          }, 0);

          const formattedBalance = totalBalance.toLocaleString();
          setTotalBalance(formattedBalance);

          setLoading(false);
        }
      } catch (error) {
        setError(error.message); // เก็บข้อผิดพลาดใน state
      } finally {
        setLoading(false); // สิ้นสุดการโหลด
      }
    };

    fetchData(); // เรียกฟังก์ชัน fetch ข้อมูล
  }, [location.search]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!datas) return <div>No Data Available</div>;

  const handleBack = () => {
    navigate(`/Dashboard?tab=dashboard`);
  };

  return (
    <main>
      <section className="relative">
        <button
          onClick={handleBack}
          className="absolute top-0 left-2 py-2 px-6 bg-black text-white font-bold rounded-md"
        >
          Back
        </button>
        <div className="w-full text-center my-4">
          <h1 className="text-5xl font-bold text-serif">
            {HeaderDetail} Infomation
          </h1>
          <hr className="border-b m-10" />
        </div>
        <div className="flex flex- justify-center gap-2 mt-4">
          <div className="h-[150px] w-1/5 shadow-md border rounded-tl-3xl rounded-br-3xl p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold">Total Users</h3>
              <FaUser className="text-3xl mr-4" />
            </div>
            <p className="text-3xl mt-4 font-bold">
              {totalUsers} <span className="text-xl">User</span>
            </p>
          </div>
          <div className="h-[150px] w-1/5 shadow-md border rounded-tl-3xl rounded-br-3xl p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold">Total Balance</h3>
              <BsCashStack className="text-4xl mr-4" />
            </div>
            <p className="text-3xl font-bold mt-4"> € {totalBalance}</p>
          </div>
        </div>
      </section>

      <section className="p-4">
        <div className="grid grid-cols-6 gap-4">
          <article className="p-2 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Education</h1>
              <div className="h-3/4 flex items-center justify-center">
                <PieChart data={datas} category="education" />
              </div>
            </div>
          </article>
          <article className="p-2 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Marital</h1>
              <div className="h-3/4 flex items-center justify-center">
                <PieChart data={datas} category="marital" />
              </div>
            </div>
          </article>
          <article className="p-2 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Housing</h1>
              <div className="h-3/4 flex items-center justify-center">
                <PieChart data={datas} category="housing" />
              </div>
            </div>
          </article>
          <article className="p-2 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Loan</h1>
              <div className="h-3/4 flex items-center justify-center">
                <PieChart data={datas} category="loan" />
              </div>
            </div>
          </article>
          <article className="p-2 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Contact</h1>
              <div className="h-3/4 flex items-center justify-center">
                <PieChart data={datas} category="contact" />
              </div>
            </div>
          </article>
          <article className="p-2 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Have Credit</h1>
              <div className="h-3/4 flex items-center justify-center">
                <PieChart data={datas} category="y" />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="p-4 w-full">
        <div className="flex w-full flex-grow space-x-4">
          <article className="flex-1 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Gender</h1>
              <BarChart data={datas} category="gender" option="horizontal" />
            </div>
          </article>
          <article className="flex-1 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Age</h1>
              <BarChart data={datas} category="age" />
            </div>
          </article>
        </div>
      </section>

      <section className="p-4 w-full">
        <div className="flex w-full flex-grow space-x-4">
          <article className="flex-1 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">age-balance</h1>
              <LineChart data={datas} />
            </div>
          </article>
          <article className="flex-1 shadow-md border rounded-xl">
            <div className="h-full w-full text-center">
              <h1 className="text-5xl font-bold my-4">Pdays</h1>
              <LineChartPdays data={datas} category="pdays" />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Detail;
