// src/components/GameOver.jsx

import { useLocation } from 'react-router-dom';

const GameOver = () => {
  const location = useLocation();
  const { score } = location.state || { score: 0 };  // Recibir el score a través de la ubicación

  return (
    <div className="game-finished game-over">
      <h1>Game Over</h1>
      <p>Your score: {score}</p>
    </div>
  );
};

export default GameOver;