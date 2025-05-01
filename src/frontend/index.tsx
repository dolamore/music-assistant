import React, {ReactElement} from "react";
import {Provider} from "mobx-react";
import ReactDOM, {Root} from "react-dom/client";
import Metronome from "./components/Metronome";
import LoopCounter from "./components/LoopCounter";
import BpmControls from "./components/BpmControls";
import {MetronomeManager} from "./managers/MetronomeManager.js";
import VisualCheckBoxControls from "./components/VisualsCheckBoxControls";
import MainPanelControls from "./components/MainPanelControls";
import TrainingSettings from "./components/TrainingSettings.js";
import TimeSignatureControls from "./components/TimeSignatureControls";
import BeatBars from "./components/BeatBars";
import FlashingBar from "./components/FlashingBar";
import Pendulum from "./components/Pendulum";
import SettingsPanel from "./components/SettingsPanel";
import './styles/styles.css';

//TODO: проверить что оно создаёт
const rootElement: HTMLElement = document.getElementById("root") || new HTMLElement();
const root: Root = ReactDOM.createRoot(rootElement);
const metronomeManager = new MetronomeManager();

function App(): ReactElement {
    return (
        <Provider metronomeManager={metronomeManager}>
            <Metronome>
                <BpmControls/>
                <LoopCounter/>
                <VisualCheckBoxControls/>
                <MainPanelControls/>
                <TrainingSettings/>
                <TimeSignatureControls/>
                <BeatBars/>
                <FlashingBar/>
                <Pendulum/>
                <SettingsPanel/>
            </Metronome>
        </Provider>
    );
}

root.render(<App/>);