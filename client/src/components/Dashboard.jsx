import axios from "axios";
import { useEffect, useState } from "react";
import BarChart from "./chartjs/BarChart";
import PieChart from "./chartjs/PieChart";
import LineChart from "./chartjs/LineChart";
import BarCompareChart from "./chartjs/BarCompareChart";
import { BsCashStack } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const months = [
  { full: "All", short: "all" },
  { full: "January", short: "jan" },
  { full: "February", short: "feb" },
  { full: "March", short: "mar" },
  { full: "April", short: "apr" },
  { full: "May", short: "may" },
  { full: "June", short: "jun" },
  { full: "July", short: "jul" },
  { full: "August", short: "aug" },
  { full: "September", short: "sep" },
  { full: "October", short: "oct" },
  { full: "November", short: "nov" },
  { full: "December", short: "dec" },
];

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    sort: "asc",
    month: "all",
  });
  console.log(search);

  const [datas, setDatas] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [previewDatas, setPreviewDatas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatas = async () => {
      const urlParams = new URLSearchParams(location.search);
      const sortFromUrl = urlParams.get("sort") || search.sort; // ใช้ค่า sort ที่มาจาก URL หรือ search.sort
      const monthFromUrl = urlParams.get("month") || search.month;

      if (sortFromUrl || monthFromUrl) {
        setSearch({
          ...search,
          sort: sortFromUrl,
          month: monthFromUrl,
        });
      }

      try {
        const searchQuery = urlParams.toString();
        const res = await axios.get(`api/bank/getDatas?${searchQuery}`);
        const data = res.data;
        if (res.status >= 200 && res.status < 300) {
          setDatas(data.bankDatas);
          setTotalUsers(data.totalDatas);
          setPreviewDatas(data.previewDatas);

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
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);

    // ตั้งค่าให้ใช้การจัดเรียงจาก search.sort
    urlParams.set("sort", search.sort);
    urlParams.set("month", search.month);

    const searchQuery = urlParams.toString();

    // สร้าง URL ที่มี query string
    navigate(`/Dashboard?${searchQuery}`);
    setLoading(false);
  };

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
              <form onSubmit={handleSubmit}>
                <select
                  id="sort"
                  value={search.sort}
                  onChange={(e) => handleChange(e)} // ส่งอีเวนต์เข้าไปตรงๆ
                >
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>

                <label htmlFor="month-filter" className="mr-4">
                  Select Month:
                </label>
                <select
                  id="month"
                  value={search.month}
                  onChange={(e) => handleChange(e)} // ส่งอีเวนต์เข้าไปตรงๆ
                  className="border p-2 rounded"
                >
                  {months.map((month, index) => (
                    <option key={index} value={month.short}>
                      {month.full}
                    </option>
                  ))}
                </select>
                <button type="submit">Submit</button>
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

          <section className="col-span-5 p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b">ID</th>
                    <th className="px-4 py-2 border-b">Age</th>
                    <th className="px-4 py-2 border-b">Job</th>
                    <th className="px-4 py-2 border-b">Marital</th>
                    <th className="px-4 py-2 border-b">Education</th>
                    <th className="px-4 py-2 border-b">Default</th>
                    <th className="px-4 py-2 border-b">Balance</th>
                    <th className="px-4 py-2 border-b">Housing</th>
                    <th className="px-4 py-2 border-b">Loan</th>
                    <th className="px-4 py-2 border-b">Contact</th>
                    <th className="px-4 py-2 border-b">Day</th>
                    <th className="px-4 py-2 border-b">Month</th>
                    <th className="px-4 py-2 border-b">Duration</th>
                    <th className="px-4 py-2 border-b">Campaign</th>
                    <th className="px-4 py-2 border-b">Pdays</th>
                    <th className="px-4 py-2 border-b">Previous</th>
                    <th className="px-4 py-2 border-b">Poutcome</th>
                    <th className="px-4 py-2 border-b">Y</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(previewDatas) && previewDatas.length > 0 ? (
                    previewDatas.map((data) => (
                      <tr
                        key={data.id}
                        className="hover:bg-gray-50 text-center"
                      >
                        <td className="px-4 py-2 border-b">{data.id}</td>
                        <td className="px-4 py-2 border-b">{data.age}</td>
                        <td className="px-4 py-2 border-b">{data.job}</td>
                        <td className="px-4 py-2 border-b">{data.marital}</td>
                        <td className="px-4 py-2 border-b">{data.education}</td>
                        <td className="px-4 py-2 border-b">{data.default}</td>
                        <td className="px-4 py-2 border-b">{data.balance}</td>
                        <td className="px-4 py-2 border-b">{data.housing}</td>
                        <td className="px-4 py-2 border-b">{data.loan}</td>
                        <td className="px-4 py-2 border-b">{data.contact}</td>
                        <td className="px-4 py-2 border-b">{data.day}</td>
                        <td className="px-4 py-2 border-b">{data.month}</td>
                        <td className="px-4 py-2 border-b">{data.duration}</td>
                        <td className="px-4 py-2 border-b">{data.campaign}</td>
                        <td className="px-4 py-2 border-b">{data.pdays}</td>
                        <td className="px-4 py-2 border-b">{data.previous}</td>
                        <td className="px-4 py-2 border-b">{data.poutcome}</td>
                        <td className="px-4 py-2 border-b">{data.y}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="17"
                        className="text-center px-4 py-2 border-b"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
