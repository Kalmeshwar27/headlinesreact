// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import MainApp from "./MainApp"; // 👈 Changed from App to MainApp
import "./index.css";
// import reportWebVitals from "./reportWebVitals"; // optional

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MainApp /> {/* 👈 Use MainApp here */}
  </React.StrictMode>
);

// reportWebVitals(); // optional
