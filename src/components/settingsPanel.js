import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {defaultSoundSettings} from "../vars.js";

export default inject("metronomeManager")(observer(function SettingsPanel({metronomeManager}) {
    const indices = Array.from({length: metronomeManager.numberOfBeats},
        (_, i) => i + 1);

    return (
        <div id="settings-panel"
             className={`${metronomeManager.elementsManager.isSettingsPanelVisible ? '' : 'hidden'}
                        container`}>
            <h2>Sound Settings</h2>
            <div className="sound-settings">
                <div className="labels">
                    <span>Beat</span>
                    <span>Oscillator</span>
                </div>
            </div>
            {indices.map(index => (
                <SoundRow key={`sound-row-${index}`} metronomeManager={metronomeManager} index={index}/>
            ))}
            <button id="save-settings-button"
                    onClick={() => metronomeManager.elementsManager.toggleSettingsPanel()}
            >Save
            </button>
        </div>
    )                 // Сюда будет динамически добавляться содержимое через renderSoundSettings
}));

const SoundRow = observer(({metronomeManager, index}) => {
    return (
        <div className="sound-row">
            <label htmlFor={`sound-${index}`}>Beat {index}:</label>
            <select id={`sound-${index}`}>
                <option value="0">No Sound</option>
                <option value="1" selected>Sine</option>
                <option value="2">Triangle</option>
                <option value="3">Square</option>
                <option value="4">Sawtooth</option>
            </select>
            {Object.keys(defaultSoundSettings).map(key => (
                <input
                    key={key}
                    id={`${key}-${index}`}
                    type="number"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    defaultValue={defaultSoundSettings[key]}
                />
            ))}
        </div>
    )
});