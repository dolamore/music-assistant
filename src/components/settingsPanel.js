import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function SettingsPanel({metronomeManager}) {
    return (
        <div id="settings-panel" className="hidden container">
            <h2>Sound Settings</h2>
            <div className="sound-settings">
                <div className="labels">
                    <span>Beat</span>
                    <span>Oscillator</span>
                </div>
            </div>
            <button id="save-settings-button">Save</button>
        </div>
    )                 // Сюда будет динамически добавляться содержимое через renderSoundSettings
}));