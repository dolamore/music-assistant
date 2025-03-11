import React from "react";
import ReactDOM from "react-dom/client";
import Metronome from "./Metronome.js";
import BpmControls from "./components/bpmControls.js";
import {MetronomeManager} from "./managers/metronomeManager.js";

// Находим div с id="root" и рендерим в него React-приложение
const root = ReactDOM.createRoot(document.getElementById("root"));
const metronomeManager = new MetronomeManager();

root.render(
    <Metronome>
        <BpmControls metronomeManager={metronomeManager}/>
    </Metronome>
);
