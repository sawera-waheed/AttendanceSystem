import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useReducer } from "react";

import StudentPage from "./components/StudentPage";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPage from "./components/AdminPage";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import context from "./context/context";
import reducer from "./context/reducer";
import UnAuthorized from "./components/UnAuthorized";
import Notfound from "./components/Notfound";
import FindAccountForm from "./components/ForgotPasswordComponents/FindAccountForm";
import RecoveryCodeForm from "./components/ForgotPasswordComponents/RecoveryCodeForm";
import NewPasswordForm from "./components/ForgotPasswordComponents/NewPasswordForm";

function App() {
  const initialState = {};
  const navigate = useNavigate();
  const location = useLocation();
  const token = window.localStorage.getItem("token");
  const user = JSON.parse(window.localStorage.getItem("user"));
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/login");
    }
  }, [location, navigate]);

  const logoutHandler = () => {
    window.localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <context.Provider value={[state, dispatch]}>
        <Navbar logoutHandler={logoutHandler} />
        <Routes>
          <Route
            path="/student"
            element={
              token ? (
                user?.isAdmin === false ? (
                  <StudentPage />
                ) : (
                  <Navigate to={"/unauthorized"} />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/login"
            element={
              token ? (
                user?.isAdmin === true ? (
                  <Navigate to={"/admin"} />
                ) : (
                  <Navigate to={"/student"} />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/register"
            element={
              token ? (
                user?.isAdmin === true ? (
                  <Navigate to={"/admin"} />
                ) : (
                  <Navigate to={"/student"} />
                )
              ) : (
                <Register />
              )
            }
          />
          <Route path="/forgot-password" element={<FindAccountForm />} />
          <Route path="/recovery-code" element={<RecoveryCodeForm />} />
          <Route path="/new-password" element={<NewPasswordForm />} />
          <Route
            path="/profile"
            element={token ? <Profile /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/admin"
            element={
              token ? (
                user?.isAdmin === true ? (
                  <AdminPage />
                ) : (
                  <Navigate to={"/unauthorized"} />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </context.Provider>
    </>
  );
}

export default App;
