import Sidebar from "../../components/Sidebar";
import Dashboard from "../../components/Dashboard";
import DashUser from "../../components/DashUser";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Detail from "../../components/Detail";
import Create from "../Create/Create";

function MainDash() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  console.log(tab);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromURL = urlParams.get("tab");
    if (tabFromURL) {
      setTab(tabFromURL);
    }
  }, [location.search]);
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full h-screen overflow-auto">
        <Navbar />
        {/* Dashboard */}
        {tab === "dashboard" && <Dashboard />}
        {tab === "detail" && <Detail />}

        {/* Admin */}
        {tab === "posts" && <Create />}
        {tab === "users" && <DashUser />}
      </div>
    </div>
  );
}

export default MainDash;
