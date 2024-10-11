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

const ageRanges = [
  { label: "All", value: "all" },
  { label: "18-29", value: "18-29" },
  { label: "30-39", value: "30-39" },
  { label: "40-49", value: "40-49" },
  { label: "50-59", value: "50-59" },
  { label: "60-69", value: "60-69" },
  { label: "70-79", value: "70-79" },
  { label: "80-89", value: "80-89" },
  { label: "90-100", value: "90-100" },
];

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    sort: "desc",
    month: "all",
    ageRange: "all",
  });

  const [datas, setDatas] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [rowsToShow, setRowsToShow] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(tableData);

  useEffect(() => {
    const fetchDatas = async () => {
      const urlParams = new URLSearchParams(location.search);
      const sortFromUrl = urlParams.get("sort") || search.sort; // ใช้ค่า sort ที่มาจาก URL หรือ search.sort
      const monthFromUrl = urlParams.get("month") || search.month;
      const ageRangeFromUrl = urlParams.get("ageRange") || search.ageRange;

      if (sortFromUrl || monthFromUrl || ageRangeFromUrl) {
        setSearch({
          ...search,
          sort: sortFromUrl,
          month: monthFromUrl,
          ageRange: ageRangeFromUrl,
        });
      }

      try {
        // เพิ่ม limit เป็นพารามิเตอร์ใน query string
        const searchQuery = urlParams.toString() + `&limit=${rowsToShow}`;
        const res = await axios.get(`api/bank/getDatas?${searchQuery}`);
        const data = res.data;
        if (res.status >= 200 && res.status < 300) {
          setDatas(data.bankDatas);
          setTotalUsers(data.totalDatas);
          setTableData(data.previewDatas);

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
  }, [location.search, rowsToShow]); // เพิ่ม rowsToShow ใน dependencies

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
    urlParams.set("ageRange", search.ageRange);

    const searchQuery = urlParams.toString();

    // สร้าง URL ที่มี query string
    navigate(`/Dashboard?${searchQuery}`);
    setLoading(false);
  };

  const handleRowsChange = (event) => {
    setRowsToShow(Number(event.target.value));
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

          <section className="col-span-2 grid grid-cols-2 pr-4">
            <section className="col-span-2 h-[180px] p-4">
              <form onSubmit={handleSubmit}>
                <select
                  id="sort"
                  value={search.sort}
                  onChange={(e) => handleChange(e)} // ส่งอีเวนต์เข้าไปตรงๆ
                >
                  <option value="desc">Lastest</option>
                  <option value="asc">Oldest</option>
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

                <select
                  id="ageRange"
                  value={search.ageRange}
                  onChange={(e) => handleChange(e)}
                >
                  <option value="">Select Age Range</option>
                  {ageRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
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
                <BarCompareChart
                  data={datas}
                  category={["job", "balance"]}
                  option="horizontal"
                />
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
            <label htmlFor="rowsSelect" className="mr-2">
              Show rows:{" "}
            </label>
            <select
              id="rowsSelect"
              value={rowsToShow}
              onChange={handleRowsChange}
              className="border p-2"
            >
              <option value={10}>Top 10</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
            <div className="overflow-x-auto h-[500px]">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b">Bank_ID</th>
                    <th className="px-4 py-2 border-b">Name</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Gender</th>
                    <th className="px-4 py-2 border-b">Age</th>
                    <th className="px-4 py-2 border-b">Job</th>
                    <th className="px-4 py-2 border-b">Marital</th>
                    <th className="px-4 py-2 border-b">Education</th>
                    <th className="px-4 py-2 border-b">Balance</th>
                    <th className="px-4 py-2 border-b">Housing</th>
                    <th className="px-4 py-2 border-b">Loan</th>
                    <th className="px-4 py-2 border-b">Day</th>
                    <th className="px-4 py-2 border-b">Month</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(tableData) && tableData.length > 0 ? (
                    tableData.map((data) => (
                      <tr
                        key={data.id}
                        className="hover:bg-gray-50 text-center"
                      >
                        <td className="px-4 py-2 border-b">{data.id}</td>
                        <td className="px-4 py-2 border-b">{data.name}</td>
                        <td className="px-4 py-2 border-b">{data.email}</td>
                        <td className="px-4 py-2 border-b">{data.gender}</td>
                        <td className="px-4 py-2 border-b">{data.age}</td>
                        <td className="px-4 py-2 border-b">{data.job}</td>
                        <td className="px-4 py-2 border-b">{data.marital}</td>
                        <td className="px-4 py-2 border-b">{data.education}</td>
                        <td className="px-4 py-2 border-b">{data.balance}</td>
                        <td className="px-4 py-2 border-b">
                          {data.housing === true ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {data.loan === true ? "Yes" : "No"}
                        </td>
                        <td className="px-4 py-2 border-b">{data.day}</td>
                        <td className="px-4 py-2 border-b">{data.month}</td>
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
