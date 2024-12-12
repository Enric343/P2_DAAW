// src/components/Gameboard.jsx

import '../css/GameBoard.css';

import React, { useState, useEffect, useContext } from 'react';
import { db, ref, onValue, set } from '../../firebaseConfig';
import { UserContext } from "../context/UserContext";
import { config } from '../../config.js';
import { useNavigate } from 'react-router-dom';

const GameBoard = ({ player }) => {
  const boardSize = config.boardSize;
  const [snakes, setSnakes] = useState({ snake1: [], snake2: [] });
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (player && user) {
      set(ref(db, `info/name/${player}`), user.name);
      
      // Forzar la conexión despues del cambio de nombre
      setTimeout(() => {
        set(ref(db, `info/connected/${player}`), true);
      }, 200);
    } else {
      navigate('/');
    }
  
    return () => {};
  }, [player, user]); 

  useEffect(() => {
    // Listen for changes in the game state
    const gameStateListener = onValue(ref(db, 'game-state'), (snapshot) => {
      const gameState = snapshot.val();
      console.log('gameState:', gameState);
      if (gameState) {
        setSnakes(gameState.snakes || { snake1: [], snake2: [] });
        setFood(gameState.food || null);
        setTime(gameState.timeInSeconds || 0);
        setScore(gameState.scores[player] || 0);

  
        // Redirect to the gameOver or winner page
        if (gameState.status === 'finished') {
          let url;
          if (gameState.results && gameState.results[player] === 'gameOver') {
            url = `/gameOver`;
          } else {
            url = `/winner`;
          }
            navigate(url, { state: { score: gameState.scores[player], previousSnake: player } });
        }
      }
    });

    // Stop listening for changes when the component is unmounted
    return () => {
      gameStateListener();
    };

  }, [player, navigate]);  // Asegúrate de incluir navigate en las dependencias

  useEffect(() => {

  }, []);

  const handleKeyDown = (e) => {
    let newDirection = direction;
    switch (e.key) {
      case 'ArrowUp':
        newDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        newDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        newDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        newDirection = { x: 1, y: 0 };
        break;
      default:
        return;
    }
    set(ref(db, `info/directions/${player}`), newDirection);
    setDirection(newDirection);
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  return (
    <div>
      <div className="board" style={{ gridTemplateColumns: `repeat(${boardSize}, 45px)` }}>
        {Array.from({ length: boardSize }).map((_, row) =>
          Array.from({ length: boardSize }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={`cell ${
                snakes.snake1.some((segment) => segment.x === col && segment.y === row)
                  ? 'snake1'
                  : snakes.snake2.some((segment) => segment.x === col && segment.y === row)
                  ? 'snake2'
                  : food && food.x === col && food.y === row
                  ? 'food'
                  : ''
              }`}
            />
          ))
        )}
      </div>
      <div className='board-footer'>
        <div>
          <span className="time">Time:</span> <span>{time}</span>
        </div>
        <div>
          <span className="score">Your score:</span> <span>{score}</span>
        </div>
        
      </div>
    </div>
  );
};

export default GameBoard;
