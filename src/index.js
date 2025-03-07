import React from "react";
import ReactDOM from "react-dom/client";
import Metronome from "./Metronome.js";

// Находим div с id="root" и рендерим в него React-приложение
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Metronome />);
