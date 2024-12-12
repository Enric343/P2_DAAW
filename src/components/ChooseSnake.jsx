// src/components/ChooseSnake.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/ChooseSnake.css";

const ChooseSnake = () => {
  const navigate = useNavigate();

  return (
    <div className="choose-snake-container">
        <div className="choose-snake-title">
                <h2>Choose your snake:</h2>
        </div>
        <div className="selection-snake-container">
            <div className="snake-card snake1" onClick={() => navigate("/snake1")}> 
                <h2>Snake 1</h2>
            </div>
            <div className="snake-card snake2" onClick={() => navigate("/snake2")}>
                <h2>Snake 2</h2>
            </div>
        </div>
    </div>
  );
};

export default ChooseSnake;
