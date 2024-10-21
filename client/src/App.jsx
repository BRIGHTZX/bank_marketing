import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import MainDash from "./pages/Dashboard/MainDash";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import Create from "./pages/Create/Create";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<PrivateRoute />}>
            <Route path="/Dashboard" element={<MainDash />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/Create" element={<Create />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
