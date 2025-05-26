// Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./App.css"; // Reuse your existing styles

const Home = () => {
  return (
    <div className="start-screen">
      <h1>📰 News Headline Game</h1>
      <p>Fill in the blanks in real news headlines!</p>
      <Link to="/game">
        <button className="button-85">▶️ Start Game</button>
      </Link>
    </div>
  );
};

export default Home;
