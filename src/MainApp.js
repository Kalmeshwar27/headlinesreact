// MainApp.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import App from "./App";

const MainApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<App />} />
      </Routes>
    </Router>
  );
};

export default MainApp;
