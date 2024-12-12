// src/components/ScoreTable.jsx

import React, { useState, useEffect } from 'react';
import ApiService from '../services/ApiService'; // Asegúrate de tener el servicio adecuado
import '../css/ScoreTable.css';  // Puedes agregar un archivo CSS para estilizar la tabla

const ScoreTable = () => {
  const [topScores, setTopScores] = useState([]); // Estado para almacenar los puntajes
  const [loading, setLoading] = useState(true); // Estado para saber si estamos cargando los datos
  const [error, setError] = useState(null); // Estado para manejar errores

  // Usamos useEffect para hacer la llamada a la API
  useEffect(() => {
    ApiService.getTopScores()
      .then((response) => {
        setTopScores(response); // Asignamos la respuesta a topScores
        setLoading(false); // Indicamos que ya terminamos de cargar
      })
      .catch((error) => {
        setError('Error fetching top scores');
        setLoading(false);
      });
  }, []); // El array vacío asegura que esto se ejecute solo una vez cuando se monta el componente

  if (loading) {
    return <div>Loading...</div>; // Mostramos un mensaje mientras cargan los datos
  }

  if (error) {
    return <div>{error}</div>; // Mostramos un mensaje de error si hay algún problema
  }

  return (
    <div className="score-table-container">
      <h1>Top Scores</h1>
      <table className="score-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {topScores.map((scoreItem, index) => (
            <tr key={scoreItem.id}>
              <td>{index + 1}</td>
              <td>{scoreItem.player.name}</td>
              <td>{scoreItem.score}</td>
              <td>{scoreItem.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
