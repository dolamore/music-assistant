import React from "react";
import ReactDOM from "react-dom/client";
import Metronome from "./Metronome.js";
import LoopCounter from "./components/loopCounter.js";
import BpmControls from "./components/bpmControls.js";
import {MetronomeManager} from "./managers/metronomeManager.js";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
const metronomeManager = new MetronomeManager();

root.render(
    <Metronome>
        <BpmControls metronomeManager={metronomeManager}/>
        <LoopCounter/>
    </Metronome>
);