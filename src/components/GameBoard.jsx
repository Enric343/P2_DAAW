import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../css/GameBoard.css';
import { config } from '../../config.js';

const socket = io('http://localhost:3000'); // Conecta al servidor WebSocket

const GameBoard = ({ player }) => {
  const boardSize = config.boardSize;
  const [snakes, setSnakes] = useState({ snake1: [], snake2: [] });
  const [food, setFood] = useState(null);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Escuchar el estado inicial del juego
    socket.on('gameState', ({ snakes, food }) => {
      setSnakes(snakes);
      setFood(food);
    });

    // Escuchar evento de Game Over
    socket.on('gameOver', (loser) => {
      if (loser === player) {
        setGameOver(true);
      }
    });

    return () => {
      socket.off('gameState');
      socket.off('gameOver');
    };
  }, [player]);

  useEffect(() => {
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
      
      console.log('Player', player, 'changed direction to', newDirection);
      socket.emit('changeDirection', { player, direction: newDirection });
      setDirection(newDirection);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction, player]);

  const gridStyle = {
    gridTemplateColumns: `repeat(${boardSize}, 20px)`,
    gridTemplateRows: `repeat(${boardSize}, 20px)`,
  };

  return (
    <div className="board" style={gridStyle}>
      {Array.from({ length: boardSize }).map((_, row) =>
        Array.from({ length: boardSize }).map((_, col) => (
          <div
            key={`${row}-${col}`}
            className={`cell ${
              snakes.snake1.some(segment => segment.x === col && segment.y === row)
                ? 'snake1'
                : snakes.snake2.some(segment => segment.x === col && segment.y === row)
                ? 'snake2'
                : food && food.x === col && food.y === row
                ? 'food'
                : ''
            }`}
          />
        ))
      )}
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default GameBoard;
