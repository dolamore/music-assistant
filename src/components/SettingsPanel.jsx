import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {DEFAULT_SOUND_SETTINGS, SOUNDS} from "../vars.js";
import {set} from "mobx";

export default inject("metronomeManager")(observer(function SettingsPanel({metronomeManager}) {
    const indices = metronomeManager.beatBarsManager.beats.map((_, i) => i);
    const numColumns = Object.keys(DEFAULT_SOUND_SETTINGS).length + 1; // +1 for oscillator
    return (
        <div id="settings-panel"
             className={`${metronomeManager.elementsManager.isSettingsPanelVisible ? '' : 'hidden'}
                        container`}>
            <h2>Sound Settings</h2>
            <div className="sound-settings-grid" style={{gridTemplateColumns: `150px repeat(${numColumns}, 1fr)`}}>
                <div className="labels">
                    <span>Beat</span>
                    <span>Oscillator</span>
                    {Object.keys(DEFAULT_SOUND_SETTINGS).map(key => (
                        <span key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                    ))}
                </div>
                {indices.map(index => (
                    <SoundRow key={`sound-row-${index}`} metronomeManager={metronomeManager} index={index}/>
                ))}
            </div>
            <button id="save-settings-button"
                    onClick={() => metronomeManager.elementsManager.toggleSettingsPanel()}
            >Save
            </button>
        </div>
    )                 // Сюда будет динамически добавляться содержимое через renderSoundSettings
}));

const SoundRow = observer(({metronomeManager, index}) => {
    const handleSelectedSoundsChange = (e) => {
        const newValue = Number(e.target.value);
        set(metronomeManager.soundManager.selectedSounds, index, newValue);
        // const newValue = SOUNDS[Number(e.target.value)];
        // set(metronomeManager.beatBarsManager.beats[index], 'sound', newValue);
    };

    const handleSoundSettingsChange = (e, key) => {
        const newValue = Number(e.target.value);
        set(metronomeManager.soundManager.soundSettings[index], key, newValue);
    };

    return (
        <div className="sound-row">
            <label htmlFor={`sound-${index}`}>Beat {index + 1}:</label>
            <select
                id={`sound-${index}`}
                value={metronomeManager.soundManager.selectedSounds[index]}
                onChange={handleSelectedSoundsChange}
            >
                <option value="0">No Sound</option>
                <option value="1" selected>Sine</option>
                <option value="2">Triangle</option>
                <option value="3">Square</option>
                <option value="4">Sawtooth</option>
            </select>
            {Object.keys(DEFAULT_SOUND_SETTINGS).map(key => (
                <input
                    key={key}
                    id={`${key}-${index}`}
                    type="number"
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={metronomeManager.soundManager.soundSettings[index][key]}
                    onChange={(e) => handleSoundSettingsChange(e, key)}
                />
            ))}
        </div>
    )
});