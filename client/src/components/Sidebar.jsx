import { createContext, useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

// icon
import { BiArrowFromRight } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxFill } from "react-icons/ri";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsFilePost } from "react-icons/bs";
import { HiChartPie } from "react-icons/hi";
import { LiaCommentSolid } from "react-icons/lia";

import { useSelector } from "react-redux";
import { FaBars } from "react-icons/fa";

const SidebarContext = createContext();

export default function Sidebar() {
  const currentUser = useSelector((state) => state.user.currentUser);

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
      const res = await axios.post("/api/user/signout");

      console.log(res.data); // Debugging line
    } catch (error) {
      console.log("Error during signout:", error.message);
    }
  };

  const openSidebar = () => {
    setExpanded((expanded) => !expanded);
  };

  return (
    <aside
      className={`z-10 ${
        expanded ? "w-56" : "w-16"
      } transition-[width] duration-500`}
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
                  icon={<CgProfile />}
                  text="Dashboard"
                  currentUser={currentUser.isadmin}
                  active={tab == "dashboard"}
                  alert
                />
              </Link>
              <hr />
              {currentUser.isadmin === true && (
                <>
                  <Link to="/Dashboard?tab=posts">
                    <SidebarItem
                      icon={<BsFilePost />}
                      text="Add"
                      active={tab == "posts"}
                    />
                  </Link>
                  <Link to="/Dashboard?tab=users">
                    <SidebarItem
                      icon={<HiOutlineUserGroup />}
                      text="Users"
                      active={tab == "users"}
                    />
                  </Link>
                </>
              )}
            </div>
            <hr />
            <SidebarItem
              className="flex-grow"
              icon={<RiLogoutBoxFill />}
              text="Signout"
              onClick={handleSignout} // Make sure this is a button element
            />
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({
  icon,
  text,
  currentUser,
  active,
  alert,
  ...props
}) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      {...props}
      className={`group
            relative flex items-center py-2 px-3 my-1
            rounded-md cursor-pointer z-50

            ${active ? "bg-gray-500/20 text-primary" : ""}
            hover:bg-gray-500/50
        `}
    >
      {icon}
      <span
        className={`flex overflow-hidden transition-all ${
          expanded ? "ml-3" : "w-0"
        }`}
      >
        {text === "Profile" ? (
          <>
            {text}
            <span className="flex items-center text-sm font-bold bg-gray-400 px-2 ml-5 rounded-sm">
              {currentUser === true ? "Admin" : "User"}
            </span>
          </>
        ) : (
          text
        )}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-blue-600
                        ${expanded ? "" : "top-2"}
                    `}
        />
      )}

      {!expanded && (
        <div
          className={`
                       absolute left-full rounded-md px-2 py-1 ml-6
                        bg-primary text-secondary text-sm 
                        opacity-0 -translate-x-3 transition-all
                        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
                    `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
