import Navbar from "./Navbar";

function Dashboard({ sidebarToggle, setSidebarToggle }) {
  return (
    <div
      className={`w-full transition-all duration-300 ${
        sidebarToggle ? "" : " ml-64"
      }`}
    >
      <Navbar
        sidebartoggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
    </div>
  );
}

export default Dashboard;
