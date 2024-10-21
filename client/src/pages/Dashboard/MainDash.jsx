import Sidebar from "../../components/Sidebar";
import Dashboard from "../../components/Dashboard";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Detail from "../../components/Detail";

function MainDash() {
  const location = useLocation();
  const [tab, setTab] = useState("");

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
      <div
        className={`w-full h-screen overflow-auto ${
          tab === "add_infomation" ? `` : `bg-gray-50`
        }`}
      >
        <Navbar />
        {/* Dashboard */}
        {tab === "dashboard" && <Dashboard />}
        {tab === "detail" && <Detail />}
      </div>
    </div>
  );
}

export default MainDash;
