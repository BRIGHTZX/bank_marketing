import { createContext, useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { fireToast } from "./Toast";
// icon
import { BiArrowFromRight } from "react-icons/bi";
import { RiLogoutBoxFill } from "react-icons/ri";
import { BsFilePost } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";

import { useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";

const SidebarContext = createContext();

export default function Sidebar() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await axios.post("/api/auth/signout");
      const data = res.data;

      if (res.status >= 200 && res.status < 300) {
        fireToast("success", data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openSidebar = () => {
    setExpanded((expanded) => !expanded);
  };

  return (
    <aside
      className={`z-10 ${
        expanded ? "w-56" : "w-16"
      } transition-[width] duration-500 ease-out`}
    >
      <nav className="flex h-full flex-col border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <p
            className={`font-bold overflow-hidden ${expanded ? "w-32" : "w-0"}`}
          >
            Menu
          </p>
          <button onClick={openSidebar} className="p-1.5 rounded-lg">
            {expanded ? <BiArrowFromRight /> : <FaBars />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex flex-col px-3 transition-all duration-500 h-full">
            <div className="flex-grow borderw-full h-full">
              <Link to="/Dashboard?tab=dashboard">
                <SidebarItem
                  icon={<RxDashboard />}
                  text="Dashboard"
                  active={tab == "dashboard"}
                />
              </Link>
              <hr />
              {currentUser.isadmin === true && (
                <>
                  <Link to="/Create">
                    <SidebarItem
                      icon={<BsFilePost />}
                      text="Add"
                      active={tab == "posts"}
                    />
                  </Link>
                </>
              )}
            </div>
            <hr />
            <button onClick={handleSignout}>
              <SidebarItem
                className="flex-grow"
                icon={<RiLogoutBoxFill />}
                text="Signout"
              />
            </button>
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, ...props }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      {...props}
      className={`group
            relative flex items-center py-2 px-3 my-1
            rounded-md cursor-pointer z-50

            ${active ? "bg-gray-500/20 text-black" : ""}
            hover:bg-gray-500/50
        `}
    >
      {icon}
      <span
        className={`flex overflow-hidden transition-all ${
          expanded ? "ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {!expanded && (
        <div
          className={`
      absolute left-full rounded-md px-2 py-1 ml-6 
      bg-black text-white text-sm 
      opacity-0 -translate-x-3 transition-all
      group-hover:opacity-100 group-hover:translate-x-0
      group-hover:visible invisible
    `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
