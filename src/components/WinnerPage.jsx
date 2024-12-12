import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const WinnerPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  const { score, previousSnake } = location.state || {score: 0, previousSnake: 'snake1'};

  const [buttonDisabled, setButtonDisabled] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonDisabled(false); // Button is enabled after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, []); 

  const handleKeepPlaying = () => {
    navigate(`/${previousSnake}`);
  };

  const handleExitGame = () => {
    navigate('/score');
  }

  return (
    <div className="game-finished winner-page">
      <h1>YOU ARE THE WINNER!</h1>
      <p className="mb-1">Your score: {score}</p>
      <button 
        className="btn snake-button" 
        disabled={buttonDisabled}
        onClick={handleKeepPlaying}
      >
        Keep Playing
      </button>
      <button 
        className="btn exit-game" 
        onClick={handleExitGame}
      >
        Exit Game
      </button>
    </div>
  );
};

export default WinnerPage;
