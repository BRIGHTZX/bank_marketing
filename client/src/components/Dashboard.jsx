import axios from "axios";
import { useEffect, useState } from "react";
import BarChart from "./chartjs/BarChart";
import PieChart from "./chartjs/PieChart";
import LineChart from "./chartjs/LineChart";
import BarCompareChart from "./chartjs/BarCompareChart";
import { BsCashStack } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

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

const sectionVariants = {
  hidden: { opacity: 0, y: 50 }, // เริ่มต้นที่ซ่อนอยู่และอยู่ต่ำลง
  visible: { opacity: 1, y: 0 }, // เด้งขึ้นมาพร้อมกับแสดงผล
};

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState({
    sort: "desc",
    month: "all",
    ageRange: "all",
    searchTerm: "",
  });

  const [datas, setDatas] = useState([]);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [rowsToShow, setRowsToShow] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDatas = async () => {
      const urlParams = new URLSearchParams(location.search);
      const sortFromUrl = urlParams.get("sort") || search.sort; // ใช้ค่า sort ที่มาจาก URL หรือ search.sort
      const monthFromUrl = urlParams.get("month") || search.month;
      const ageRangeFromUrl = urlParams.get("ageRange") || search.ageRange;
      const searchTermFromUrl =
        urlParams.get("searchTerm") || search.searchTerm;

      if (sortFromUrl || monthFromUrl || ageRangeFromUrl) {
        setSearch({
          ...search,
          sort: sortFromUrl,
          month: monthFromUrl,
          ageRange: ageRangeFromUrl,
          searchTerm: searchTermFromUrl,
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
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();

    // สร้าง URL ที่มี query string
    navigate(`/Dashboard?${searchQuery}`);
    setLoading(false);
  };

  const handleRowsChange = (event) => {
    setRowsToShow(Number(event.target.value));
  };

  const filteredData = tableData.filter((data) =>
    Object.values(data)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <main className="w-full h-[90%]">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-full">
          <ClipLoader color="#000" loading={loading} size={50} />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-3xl font-bold mt-8"
          >
            Loading...
          </motion.div>
        </div>
      ) : (
        <>
          <motion.div
            className="w-full m-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={sectionVariants}
          >
            <h1 className="text-5xl font-bold ml-4">Dashboard</h1>
            <hr className="w-[95%] my-4" />
          </motion.div>
          <div className="grid grid-cols-5 gap-1">
            <section className="col-span-3 h-[180px] p-4">
              <div className="grid grid-cols-2 gap-2">
                {/* การ์ด Total Users */}
                <motion.div
                  className="h-[150px] shadow-md border rounded-tl-3xl rounded-br-3xl p-4 bg-white"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  variants={sectionVariants}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold">Total Users</h3>
                    <FaUser className="text-3xl mr-4" />
                  </div>
                  <p className="text-3xl mt-4 font-bold">
                    {totalUsers} <span className="text-xl">User</span>
                  </p>
                </motion.div>

                {/* การ์ด Total Balance */}
                <motion.div
                  className="h-[150px] shadow-md border rounded-tl-3xl rounded-br-3xl p-4 bg-white"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  variants={sectionVariants}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold">Total Balance</h3>
                    <BsCashStack className="text-4xl mr-4" />
                  </div>
                  <p className="text-3xl font-bold mt-4">€ {totalBalance}</p>
                </motion.div>
              </div>

              {/* BarChart JOB */}
              <motion.div
                className="shadow-md border mt-4 rounded-xl bg-white p-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                variants={sectionVariants}
              >
                <div className="h-full w-full text-center">
                  <h1 className="text-5xl font-bold my-4">Occupation</h1>
                  <BarChart
                    data={datas}
                    category="job"
                    xlabel="Occupation"
                    ylabel="Number of People"
                    barLabel="People per Occupation"
                    description="Number of people in each occupation. (Click on each bar for more details)"
                  />
                </div>
              </motion.div>

              {/* BarChart Age */}
              <motion.div
                className="shadow-md border mt-4 rounded-xl bg-white p-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                variants={sectionVariants}
              >
                <div className="h-full w-full text-center">
                  <h1 className="text-5xl font-bold my-4">AGE</h1>
                  <BarChart
                    data={datas}
                    category="age"
                    xlabel="Age"
                    ylabel="Number of People"
                    barLabel="People per Age"
                    description="Overview of the population distribution by Age"
                  />
                </div>
              </motion.div>
            </section>

            <section className="col-span-2 grid grid-cols-2 pr-4">
              <motion.section
                className="col-span-2 h-[180px] p-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                variants={sectionVariants}
              >
                <form
                  onSubmit={handleSubmit}
                  className="h-[150px] bg-white p-4 shadow-xl border rounded-tr-3xl rounded-bl-3xl"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-1 space-y-4">
                      <div className="flex items-center">
                        <label htmlFor="sort">
                          <p className="w-32">Sorting :</p>
                        </label>
                        <select
                          id="sort"
                          className="w-full border py-1 px-4"
                          value={search.sort}
                          onChange={(e) => handleChange(e)}
                        >
                          <option value="desc">Lastest</option>
                          <option value="asc">Oldest</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <label htmlFor="month">
                          <p className="w-32">Select Month :</p>
                        </label>
                        <select
                          id="month"
                          className="w-full border py-1 px-4"
                          value={search.month}
                          onChange={(e) => handleChange(e)}
                        >
                          {months.map((month, index) => (
                            <option key={index} value={month.short}>
                              {month.full}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-span-1 space-y-4">
                      <div className="flex items-center">
                        <label htmlFor="ageRange">
                          <p className="w-32">Grouping :</p>
                        </label>
                        <select
                          id="ageRange"
                          className="w-full border py-1 px-4"
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
                      </div>

                      <div className="flex items-center">
                        <label htmlFor="searchTerm">
                          <p className="w-32">Search :</p>
                        </label>
                        <input
                          id="searchTerm"
                          type="text"
                          value={searchTerm}
                          className="w-full border py-1 px-4"
                          placeholder="Search . . . "
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-black text-white rounded-lg hover:bg-black/80 py-1.5 px-4 font-bold w-full mt-2"
                  >
                    Submit
                  </button>
                </form>
              </motion.section>

              {/* Marital Section */}
              <motion.section
                className="p-2 shadow-md border rounded-xl mr-4 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                variants={sectionVariants}
              >
                <div className="h-full w-full text-center">
                  <h1 className="text-5xl font-bold my-4">Marital</h1>
                  <div className="h-3/4 flex items-center justify-center">
                    <PieChart data={datas} category="marital" />
                  </div>
                </div>
              </motion.section>

              {/* Housing Section */}
              <motion.section
                className="p-2 shadow-md border rounded-xl bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                variants={sectionVariants}
              >
                <div className="h-full w-full text-center">
                  <h1 className="text-5xl font-bold my-4">Housing</h1>
                  <div className="h-3/4 flex items-center justify-center">
                    <PieChart data={datas} category="housing" />
                  </div>
                </div>
              </motion.section>

              <motion.section
                className="col-span-2 p-2 shadow-md border rounded-xl mt-4 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                variants={sectionVariants}
              >
                <div className="h-full w-full text-center">
                  <h1 className="text-[33px] text-nowrap font-bold my-4">
                    Average Balance by Occupation
                  </h1>
                  <BarCompareChart
                    data={datas}
                    category={["job", "balance"]}
                    xlabel="Balance"
                    ylabel="Occupation"
                    barLabel="Balance per Occupation"
                    description="Average balance per occupation"
                    option="horizontal"
                  />
                </div>
              </motion.section>

              {/* Age - Balance LineChart */}
              <motion.section
                className="col-span-2 p-2 shadow-md border rounded-xl mt-4 bg-white"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                variants={sectionVariants}
              >
                <div className="h-full w-full text-center">
                  <h1 className="text-[33px] font-bold my-4">
                    Average Balance by Age
                  </h1>
                  <LineChart
                    data={datas}
                    xlabel="Age"
                    ylabel="Balance"
                    barLabel="Average balance per age"
                    description="Average balance per Age"
                  />
                </div>
              </motion.section>
            </section>

            <motion.section
              className="col-span-5 p-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              variants={sectionVariants}
            >
              <div className="bg-white p-2 rounded-xl shadow-xl border">
                <div>
                  <h1 className="text-center text-3xl font-bold mt-7">
                    Table Preview Infomation
                  </h1>
                  <hr className="my-6 w-[70%] text-center mx-auto" />
                  <div className="mb-4">
                    <label htmlFor="rowsSelect" className="mr-2">
                      Show rows:
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
                  </div>
                </div>
                <div className="overflow-x-auto h-[470px]">
                  <table className="min-w-full border border-gray-300 bg-white">
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
                      {filteredData.length > 0 ? (
                        filteredData.map((data) => (
                          <tr
                            key={data.id}
                            className="hover:bg-gray-50 text-center"
                          >
                            <td className="px-4 py-2 border-b">{data.id}</td>
                            <td className="px-4 py-2 border-b">{data.name}</td>
                            <td className="px-4 py-2 border-b">{data.email}</td>
                            <td className="px-4 py-2 border-b">
                              {data.gender}
                            </td>
                            <td className="px-4 py-2 border-b">{data.age}</td>
                            <td className="px-4 py-2 border-b">{data.job}</td>
                            <td className="px-4 py-2 border-b">
                              {data.marital}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {data.education}
                            </td>
                            <td className="px-4 py-2 border-b">
                              {data.balance}
                            </td>
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
              </div>
            </motion.section>
          </div>
        </>
      )}
    </main>
  );
}

export default Dashboard;
