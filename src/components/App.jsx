// src/App.js

import React from 'react';
import GameBoard from './GameBoard';
import '../css/App.css';

function App({ p }) {
    return (
        <div className="App">
            <h1>Snake Game (player {p})</h1>
            <GameBoard player={'snake'+p}/>
        </div>
    );
}

export default App;
