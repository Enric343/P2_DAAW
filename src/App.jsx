// src/App.js

import React from "react";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GameBoard from './components/GameBoard';
import NotFound from './components/NotFound';
import Login from './components/Login';
import ChooseSnake from './components/ChooseSnake';
import UserProvider from './context/UserContext';
import GameOver from './components/GameOver';
import WinnerPage from './components/WinnerPage';
import ScoreTable from "./components/ScoreTable";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/chooseSnake" element={<ChooseSnake />} />
            <Route path="/gameOver" element={<GameOver />} />
            <Route path="/winner" element={<WinnerPage />} />
            <Route path="/score" element={<ScoreTable />} />
            <Route path="/snake1" element={<GameBoard player={'snake1'} />} />
            <Route path="/snake2" element={<GameBoard player={'snake2'} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </UserProvider>
  );
};

export default App;
