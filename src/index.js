import React from "react";
import {Provider} from "mobx-react";
import ReactDOM from "react-dom/client";
import Metronome from "./Metronome.js";
import LoopCounter from "./components/loopCounter.js";
import BpmControls from "./components/bpmControls.js";
import {MetronomeManager} from "./managers/metronomeManager.js";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
const metronomeManager = new MetronomeManager();

function App() {
    return (
        <Provider metronomeManager={metronomeManager}>
            <Metronome>
                <BpmControls />
                <LoopCounter />
            </Metronome>
        </Provider>
    );
}

root.render(<App/>);