// server.mjs
import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';  // Importa el paquete cors

import { config } from './config.js';  // Importación usando la sintaxis ES

const app = express();
const server = http.createServer(app);

// Configura CORS para permitir el acceso desde tu cliente en localhost:5173
app.use(cors({
  origin: 'http://localhost:5173',  // Permitir solo este origen
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Permitir solicitudes desde este origen
    methods: ['GET', 'POST'],
  }
});

const boardSize = config.boardSize;
let food = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
let snakes = {
  snake1: [{ x: 2, y: 2 }],
  snake2: [{ x: boardSize-2, y: boardSize-2 }],
};
let directions = {
  snake1: { x: 0, y: 1 },
  snake2: { x: 0, y: -1 },
};

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id);

  // Enviar el estado inicial del juego al jugador
  socket.emit('gameState', { snakes, food });

  // Escuchar el cambio de dirección
  socket.on('changeDirection', ({ player, direction }) => {
    directions[player] = direction;
  });

  // Mover las serpientes en intervalos
  const gameInterval = setInterval(() => {
    Object.keys(snakes).forEach((player) => {
      const head = snakes[player][0];
      const newHead = { x: head.x + directions[player].x, y: head.y + directions[player].y };
      // Verificar colisiones
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= boardSize ||
        newHead.y >= boardSize ||
        snakes[player].some(segment => segment.x === newHead.x && segment.y === newHead.y) ||
        snakes[player === 'snake1' ? 'snake2' : 'snake1'].some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        io.emit('gameOver', player);
        clearInterval(gameInterval);
        return;
      }

      // Comer comida
      if (newHead.x === food.x && newHead.y === food.y) {
        food = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
      } else {
        snakes[player].pop();
      }

      snakes[player].unshift(newHead);
    });

    // Enviar el estado actualizado a todos los clientes
    io.emit('gameState', { snakes, food });
  }, 1000);

  socket.on('disconnect', () => {
    console.log('A player disconnected:', socket.id);
    clearInterval(gameInterval);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
