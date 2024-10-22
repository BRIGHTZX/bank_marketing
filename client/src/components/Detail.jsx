import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsCashStack } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import PieChart from "./chartjs/PieChart";
import LineChartPdays from "./chartjs/LineChartPdays";
import LineChart from "./chartjs/LineChart";
import BarChart from "./chartjs/BarChart";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import MixedChart from "./chartjs/MixedChart";
import BarCompareChart from "./chartjs/BarCompareChart";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function Detail() {
  const navigate = useNavigate();
  const [HeaderDetail, setHeaderDetail] = useState();
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalBalance, setTotalBalance] = useState(null);
  const [datas, setDatas] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const HeaderJob = urlParams.get("label");
    setHeaderDetail(HeaderJob);

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
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search]);

  const handleBack = () => {
    navigate(`/Dashboard?tab=dashboard`);
  };

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
          <section className="relative">
            <button
              onClick={handleBack}
              className="absolute top-0 left-2 py-2 px-6 bg-black text-white font-bold rounded-md"
            >
              Back
            </button>
            <div className="w-full text-center my-4">
              <h1 className="text-5xl font-bold text-serif">
                {HeaderDetail} Information
              </h1>
              <hr className="border-b-0 m-10" />
            </div>
            <div className="flex justify-center gap-2 ">
              <motion.div
                className="h-[150px] w-1/5 shadow-md border rounded-tl-3xl rounded-br-3xl p-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                variants={cardVariants}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold">Total Customers</h3>
                  <FaUser className="text-3xl mr-4" />
                </div>
                <p className="text-3xl  font-bold">
                  {totalUsers} <span className="text-xl">Customers</span>
                </p>
              </motion.div>

              <motion.div
                className="h-[150px] w-1/5 shadow-md border rounded-tl-3xl rounded-br-3xl p-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                variants={cardVariants}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold">Total Balance</h3>
                  <BsCashStack className="text-4xl mr-4" />
                </div>
                <p className="text-3xl font-bold ">€ {totalBalance}</p>
              </motion.div>
            </div>
          </section>

          <section className="grid grid-cols-5">
            <section className="col-span-3">
              <div className="p-4">
                <motion.article
                  className="shadow-md border rounded-xl p-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.1,
                  }}
                  variants={cardVariants}
                >
                  <div className="h-full w-full text-center">
                    <h1 className="text-5xl font-bold">
                      Monthly Balance Overview
                    </h1>
                    <MixedChart
                      data={datas}
                      category={["month", "balance"]}
                      label={["Total Count by Month", "Total Balance by Month"]}
                      xLabel="Month"
                      yLeft="Total Balance"
                      yRight="Total Count"
                      description="Monthly balance changes summary."
                    />
                  </div>
                </motion.article>
              </div>
              <div className="p-4">
                <motion.article
                  className="shadow-md border rounded-xl p-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.1,
                  }}
                  variants={cardVariants}
                >
                  <div className="h-full w-full text-center">
                    <h1 className="text-5xl font-bold my-4">
                      Average Balance by Age
                    </h1>
                    <MixedChart
                      data={datas}
                      category={["age", "balance"]}
                      label={["Total Count by Age", "Total Balance by Age"]}
                      xLabel="Ages"
                      yLeft="Total Balance"
                      yRight="Total Count"
                      description="Summary of Balance Changes by Age."
                    />
                  </div>
                </motion.article>
              </div>
              <div className="p-4">
                <motion.div
                  className="shadow-md border  rounded-xl bg-white p-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  variants={cardVariants}
                >
                  <div className="h-full w-full text-center">
                    <h1 className="text-5xl font-bold my-4">
                      Campaign Contact
                    </h1>
                    <BarCompareChart
                      data={datas}
                      category={["contact", "campaign"]}
                      xlabel="Contact Types"
                      ylabel="Number of campaign"
                      barLabel="Contact Type Campaign Summary"
                      description="Total Campaigns associated with each contact."
                    />
                  </div>
                </motion.div>
              </div>
              <div className="p-4">
                <motion.section
                  className="col-span-2 p-10 shadow-md border rounded-xl  bg-white"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  variants={cardVariants}
                >
                  <div className="h-full w-full text-center">
                    <h1 className="text-5xl font-bold my-4">
                      Monthly Campaign
                    </h1>
                    <p className="text-3xl font-bold">Overview</p>
                    <BarCompareChart
                      data={datas}
                      category={["month", "campaign"]}
                      xlabel="Month"
                      ylabel="Number of Campaign"
                      barLabel="Total Campaign per Month"
                      description="Monthly Campaign Summary"
                    />
                  </div>
                </motion.section>
              </div>
            </section>
            <section className="col-span-2 pt-4 pr-4 space-y-4">
              <motion.article
                className="shadow-md border rounded-xl p-7"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                variants={cardVariants}
              >
                <div className="h-full w-full text-center">
                  <h1 className="text-3xl font-bold my-4">Gender</h1>
                  <BarChart
                    data={datas}
                    category="gender"
                    xlabel="Number of People"
                    ylabel="Gender"
                    option="horizontal"
                    description="Distribution of people by gender."
                  />
                </div>
              </motion.article>
              <motion.article
                className="shadow-md border rounded-xl p-7"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 0.1,
                }}
                variants={cardVariants}
              >
                <div className="h-full w-full text-center">
                  <h1 className="text-3xl font-bold my-4">Age</h1>
                  <BarChart
                    data={datas}
                    category="age"
                    xlabel="Age"
                    ylabel="Number of People"
                    barLabel="People per Age in"
                    description={`Overview of the population distribution by Age in ${HeaderDetail}`}
                  />
                </div>
              </motion.article>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "education",
                  "marital",
                  "housing",
                  "loan",
                  "contact",
                  "y",
                ].map((category, index) => (
                  <motion.article
                    key={category}
                    className="p-2 shadow-md border rounded-xl"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: index * 0.1,
                    }}
                    variants={cardVariants}
                  >
                    <div className="h-full w-full text-center">
                      <h1 className="text-4xl font-bold my-4">
                        {category === "y"
                          ? "Deposit"
                          : category.charAt(0).toUpperCase() +
                            category.slice(1)}
                      </h1>
                      <div className="h-3/4 flex items-center justify-center">
                        <PieChart data={datas} category={category} />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
              <div className="p-2">
                <motion.article
                  className="shadow-md border rounded-xl p-7"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.1,
                  }}
                  variants={cardVariants}
                >
                  <div className="h-full w-full text-center">
                    <h1 className="text-3xl font-bold my-4">
                      Marital Status - Balance
                    </h1>
                    <BarCompareChart
                      data={datas}
                      category={["marital", "balance"]}
                      xlabel="Marital Status"
                      ylabel="Total Balance"
                      barLabel="Balance per Marital Status"
                      description="Average balance per marital status"
                      avg={true}
                    />
                  </div>
                </motion.article>
              </div>
              <div className="p-2">
                <motion.article
                  className="shadow-md border rounded-xl p-7"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.1,
                  }}
                  variants={cardVariants}
                >
                  <div className="h-full w-full text-center">
                    <h1 className="text-3xl font-bold my-4">
                      Education Level - Balance
                    </h1>
                    <BarCompareChart
                      data={datas}
                      category={["education", "balance"]}
                      xlabel="Education Level"
                      ylabel="Total Balance"
                      barLabel="Balance per Education Level"
                      description="Average balance per education level"
                      avg={true}
                    />
                  </div>
                </motion.article>
              </div>
            </section>
          </section>
        </>
      )}
    </main>
  );
}

export default Detail;
