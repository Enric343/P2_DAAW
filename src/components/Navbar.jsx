// src/components/Navbar.jsx

import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad, fa1, fa2, faUser } from "@fortawesome/free-solid-svg-icons";
import "../css/Navbar.css";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <FontAwesomeIcon icon={faGamepad} size="3x" />
        <h1 className="game-title">Snake Attack</h1>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li className="snake1">
            <Link to="/snake1"><span>Snake </span><FontAwesomeIcon icon={fa1} /></Link>
          </li>
          <li className="snake2">
          <Link to="/snake2"><span >Snake </span><FontAwesomeIcon icon={fa2} /></Link>
          </li>
          <li>
            <Link to="/score">Global Ranking</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        {user ? (
          <span className="user-name">{user.name}</span> 
        ) : 
        (
          <Link to="/login" className="login-link">Login</Link>
        )}
        <div className="user-icon">
          <FontAwesomeIcon icon={faUser} size="2x" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;