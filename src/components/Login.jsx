// src/components/Login.jsx

import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import ApiService from "../services/ApiService";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (name.trim()) {
        const request = { id: null, name: name, scores: [] };
        ApiService.createPlayer(request).then((response) => {
            setUser({ name });
            navigate("/chooseSnake"); // Redirect the user to the snake selection
        })
        .catch((error) => {
            setLoginError(true);
        });
    }
  };

  return (
    <div className="login-container">
        <div>
            <h1 className="login-title">
                <span>Welcome to </span>
                <span className="snake1">Snake </span>
                <span className="snake2">Attack</span>
                <span className="exclamation"> !</span>
            </h1>
            <div className="login-card">
                <p>Please enter your name to start playing!</p>
                <p 
                    className="login-error"
                    style={{ display: loginError ? 'block' : 'none' }}
                >
                    * Username already exists *
                </p>
                <input
                type="text"
                className="login-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
                <button className="snake-button" onClick={handleLogin}>
                    Start Game
                </button>
            </div>
        </div>
    </div>
  );
};

export default Login;
