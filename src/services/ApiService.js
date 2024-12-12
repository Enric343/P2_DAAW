// src/services/ApiService.js

import axios from 'axios';

// Define la URL base para la API
const BASE_URL = 'http://localhost:8080/api'; // Ajusta según el puerto y dominio de tu API

const ApiService = {
  // Obtener el ranking de puntajes
  getTopScores: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/score/top`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top scores:', error);
      throw error;
    }
  },

  // Crear un nuevo score
  createStore: async (player, score) => {
    try {
      const response = await axios.post(`${BASE_URL}/score/add`, {playerName: player, score: score});
      return response.data; // Mensaje de éxito o error
    } catch (error) {
      console.error('Error creating score:', error);
      throw error;
    }
  },

  // Actualizar el último score de un jugador
  updateLastScore: async (player, score) => {
    try {
      const response = await axios.post(`${BASE_URL}/score/update`, {playerName: player, score: score});
      return response.data; // Mensaje de éxito o error
    } catch (error) {
      console.error('Error creating score:', error);
      throw error;
    }
  },

  // Crear un nuevo jugador
  createPlayer: async (player) => {
    try {
      const response = await axios.post(`${BASE_URL}/player`, player);
      return response.data; // Mensaje de éxito o error
    } catch (error) {
      console.error('Error creating player:', error);
      throw error;
    }
  }
};

export default ApiService;