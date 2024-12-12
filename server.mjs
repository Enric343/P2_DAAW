// server.mjs
import { db, ref, onValue, set } from './firebaseConfig.js';
import { config } from './config.js';
import ApiService from './src/services/ApiService.js';

const boardSize = config.boardSize;
let currentGame, food, snakes, directions, names, results, scores, time, status;

// Clear the database
set(ref(db, '/'), {});

const conectionRef = ref(db, 'info/connected');
const directionsRef = ref(db, 'info/directions');
const namesRef = ref(db, 'info/name');
const gameStateRef = ref(db, 'game-state');

const updateGameState = () => {
  let timeInSeconds = Math.floor(time / 1000);
  set(gameStateRef, { snakes, food, timeInSeconds, scores, status, results });
};

let previousWinner = null;

const resetGame = () => {
  if (currentGame) clearInterval(currentGame);
  food = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
  snakes = {
    snake1: [{ x: 2, y: 2 }],
    snake2: [{ x: boardSize - 2, y: boardSize - 2 }],
  };
  directions = {
    snake1: { x: 0, y: 1 },
    snake2: { x: 0, y: -1 },
  };
  scores = {
    snake1: 10000,
    snake2: 10000,
  };
  if (!names) names = {};
  time = 0;
  status = 'waiting';
  results = {
    snake1: 'winner',
    snake2: 'winner',
  };
  set(ref(db, 'info/connected'), {}); // Reset connections
  updateGameState();
}
resetGame();

const isKilledByOtherSnake = (head, player) => {
  return Object.keys(snakes).some((snake) => {
    if (snake !== player) {
      return snakes[snake].some((segment) => segment.x === head.x && segment.y === head.y);
    }
  });
};

// Handle winner
const handleWinner = (player) => {
  if (previousWinner && previousWinner.name === names[player]) {
    ApiService.updateLastScore(names[player], scores[player]).then(() => {
    })
    .catch((error) => {
      console.error('Error updating score:', error);
    });

  } else {
    ApiService.createStore(names[player], scores[player]).then(() => {
    })
    .catch((error) => {
      console.error('Error creating score:', error);
    });
  }

  ApiService.getTopScores().then((response) => {});

  // Update previous winner
  previousWinner = { name: names[player], player: player,  score: scores[player] };
};

// Handle direction changes
onValue(directionsRef, (snapshot) => {
  const newDirections = snapshot.val();
  if (newDirections) {
    directions.snake1 = newDirections.snake1 || directions.snake1;
    directions.snake2 = newDirections.snake2 || directions.snake2;
  }
});

// Set player names
onValue(namesRef, (snapshot) => {
  const newNames = snapshot.val();
  if (newNames) {
    names.snake1 = newNames.snake1 || 'Anonymous';
    names.snake2 = newNames.snake2 || 'Anonymous';
  }
});

// Handle connection changes
onValue(conectionRef, (snapshot) => {
  const connections = snapshot.val();
  if (connections) {
    // Start the game loop only after both players are connected
    if (connections.snake1 && connections.snake2) {
      status = 'running';
      console.log('Game started!');
      
      if (previousWinner && Object.values(names).includes(previousWinner.name)) {
        results[previousWinner.player] = 'winner';
        scores[previousWinner.player] += previousWinner.score;
      }
      
      updateGameState();
      runGameLoop();
    }
  } else {
    status = 'waiting';
  }
});

// Start game loop function
const runGameLoop = () => {
  currentGame = setInterval(() => {
    Object.keys(snakes).forEach((player) => {
      const head = snakes[player][0];
      const newHead = { x: head.x + directions[player].x, y: head.y + directions[player].y };

      // Check if snake collides with boundaries or itself
      if (
        newHead.x < 0 || newHead.y < 0 ||
        newHead.x >= boardSize || newHead.y >= boardSize ||
        snakes[player].some((segment) => segment.x === newHead.x && segment.y === newHead.y) ||
        isKilledByOtherSnake(newHead, player)
      ) {
        scores[player] -= 5000; // Penalize player for dying
        status = 'finished';
        results[player] = 'gameOver';
        
        return;
      }

      // Check if snake eats food
      if (newHead.x === food.x && newHead.y === food.y) {
        food = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
        scores[player] += 2500; // Reward player for eating food
      } else {
        snakes[player].pop();
        scores[player] -= 100; // Penalize player for losing time
      }

      // Update snake
      snakes[player].unshift(newHead);
    });

    // Update time and game state
    time += 200;
    updateGameState();

    if (status === 'finished') {
      if (results.snake1 === 'winner') handleWinner('snake1');
      else if (results.snake2 === 'winner') handleWinner('snake2');
      resetGame();
    }
  }, 200);
};
