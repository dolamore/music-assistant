import React, {ReactElement} from "react";
import ReactDOM from "react-dom/client";
import Metronome from "./components/Metronome";
import LoopCounter from "./components/LoopCounter";
import BpmControls from "./components/BpmControls";
import {MetronomeManager} from "./managers/MetronomeManager";
import VisualCheckBoxControls from "./components/VisualsCheckBoxControls";
import MainPanelControls from "./components/MainPanelControls";
import TrainingSettings from "./components/TrainingSettings";
import TimeSignatureControls from "./components/TimeSignatureControls";
import BeatBars from "./components/BeatBars";
import FlashingBar from "./components/FlashingBar";
import Pendulum from "./components/Pendulum";
import SettingsPanel from "./components/SettingsPanel";
import "./styles/styles.css";
import {AudioContextProvider} from "./components/AudioContextProvider";

const rootElement = document.getElementById("root");

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    const metronomeManager = new MetronomeManager();

    //TODO: сделать доступным только для тестов
    window.__METRONOME_MANAGER__ = metronomeManager || {};


    function App(): ReactElement {
        return (
            <AudioContextProvider>
                <Metronome>
                    <BpmControls metronomeManager={metronomeManager}/>
                    <LoopCounter metronomeManager={metronomeManager}/>
                    <VisualCheckBoxControls metronomeManager={metronomeManager}/>
                    <MainPanelControls metronomeManager={metronomeManager}/>
                    <TrainingSettings metronomeManager={metronomeManager}/>
                    <TimeSignatureControls metronomeManager={metronomeManager}/>
                    <BeatBars metronomeManager={metronomeManager}/>
                    <FlashingBar metronomeManager={metronomeManager}/>
                    <Pendulum metronomeManager={metronomeManager}/>
                    <SettingsPanel metronomeManager={metronomeManager}/>
                </Metronome>
            </AudioContextProvider>
        );
    }

    root.render(<App/>);
    console.log(window.__METRONOME_MANAGER__);
} else {
    console.error("Root element not found");
}
