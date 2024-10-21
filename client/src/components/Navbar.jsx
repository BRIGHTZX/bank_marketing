import axios from "axios";
import { fireToast } from "./Toast";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";

function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      const res = await axios.post("/api/auth/signout");
      const data = res.data;

      if (res.status >= 200 && res.status < 300) {
        fireToast("success", data.message);
        setDropdownOpen(false);
        dispatch(signOutSuccess());
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-white px-4 py-3 flex justify-between w-full border-b sticky top-0">
      {/* Left */}
      <div className="flex items-center text-xl">
        <span className="font-semibold">Dashboard</span>
      </div>
      {/* Right */}
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown */}
        <button onClick={toggleDropdown}>
          <p>{currentUser.username}</p>
        </button>
        {isDropdownOpen && (
          <div
            id="profile-dropdown"
            className="z-10 absolute top-full right-0 text-black bg-gray-50 rounded-xl shadow w-32"
          >
            <ul className="py-2 text-sm text-center font-bold">
              <li>
                <button onClick={handleSignOut} className="hover:underline">
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
