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
                    {DEFAULT_SOUND_SETTINGS.map(setting => (
                        <span key={setting.label}>{setting.label}</span>
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
        // const newValue = Number(e.target.value);
        // console.log(newValue);
        // set(metronomeManager.soundManager.selectedSounds, index, newValue);
        // console.log(metronomeManager.soundManager.selectedSounds);
         const newValue = Number(e.target.value);
         set(metronomeManager.beatBarsManager.beats[index], 'sound', SOUNDS[newValue]);
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
                value={metronomeManager.beatBarsManager.beats[index]}
                onChange={handleSelectedSoundsChange}
            >
                {SOUNDS.map((sound, soundIndex) => (
                    <option
                        key={`sound-${soundIndex}`}
                        value={soundIndex}
                        selected={metronomeManager.beatBarsManager.beats[index].sound === sound}
                    >
                        {sound.label}
                    </option>
                ))}
            </select>
            {DEFAULT_SOUND_SETTINGS.map(setting => (
                <input
                    key={setting.key}
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