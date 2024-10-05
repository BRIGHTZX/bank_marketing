import Sidebar from "../../components/Sidebar";
import Dashboard from "../../components/Dashboard";
import DashUser from "../../components/DashUser";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

        {/* Admin */}
        {tab === "users" && <DashUser />}
      </div>
    </div>
  );
}

export default MainDash;
