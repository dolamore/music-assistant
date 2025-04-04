import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function MainPanelControls({metronomeManager}) {
    return (
        <div className="main-panel-controls container">
            <button id="start-stop-button">Start</button>
            <button id="settings-button">Settings</button>
            <label>
                <input type="checkbox" id="toggle-training-mode"/> Training Mode
            </label>
        </div>
    );
}));