import React from "react";

import "./Navbar.css";
import { NavLink } from "react-router-dom";

const Navbar = ({ logoutHandler }) => {
  const isLoggedIn = JSON.parse(window.localStorage.getItem("isLoggedIn"));
  const isAdmin = JSON.parse(window.localStorage.getItem("isAdmin"));
  return (
    <div className="nav">
      <div className="logo">
        <h2>Attendence System</h2>
      </div>
      <div
        className="menu"
        style={isLoggedIn ? { width: "20%" } : { width: "14%" }}
      >
        <ul>
          {isLoggedIn && (
            <li>
              <NavLink
                to={isAdmin ? "/admin" : "/student"}
                className="nav_link"
                style={({ isActive }) =>
                  isActive ? { color: "orange" } : null
                }
              >
                Home
              </NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <NavLink
                to="/profile"
                className="nav_link"
                style={({ isActive }) =>
                  isActive ? { color: "orange" } : null
                }
              >
                Profile
              </NavLink>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink
                to="/login"
                className="nav_link"
                style={({ isActive }) =>
                  isActive ? { color: "orange" } : null
                }
              >
                Login
              </NavLink>
            </li>
          )}
          {!isLoggedIn && (
            <li>
              <NavLink
                to="/register"
                className="nav_link"
                style={({ isActive }) =>
                  isActive ? { color: "orange" } : null
                }
              >
                Register
              </NavLink>
            </li>
          )}
          {isLoggedIn && (
            <li onClick={logoutHandler}>
              <NavLink to="#" className="nav_link">
                Logout
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
