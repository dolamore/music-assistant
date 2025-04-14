import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {DEFAULT_SOUND_SETTINGS} from "../vars/vars.js";
import{SOUNDS} from "../vars/SOUNDS.ts";


export default inject("metronomeManager")(observer(function SettingsPanel({metronomeManager}) {
    const indices = metronomeManager.beatBarsManager.beats.map((_, i) => i);
    const numColumns = Object.keys(DEFAULT_SOUND_SETTINGS).length + 1; // +1 for oscillator
    return (
        <div id="settings-panel"
             className={`${metronomeManager.elementsManager.isSettingsPanelVisible ? '' : 'hidden'}
                        container`}>
            <h2>Sound Settings</h2>
            <div className="sound-settings-grid" style={{gridTemplateColumns: `150px repeat(${numColumns}, 1fr)`}}>
                <div className="sounds-settings-labels">
                    <span>Beat</span>
                    <span>Oscillator</span>
                    {DEFAULT_SOUND_SETTINGS.map(setting => (
                        <span key={`${setting.key}-label`}>{setting.label}</span>
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
        metronomeManager.beatBarsManager.beats[index].beatSound =
            SOUNDS.find(sound => sound.label === e.target.value);
    };

    const handleSoundSettingsChange = (e, key) => {
        const newValue = Number(e.target.value);
        metronomeManager.beatBarsManager.beats[index].updateSoundSetting(key, newValue);
    };

    return (
        <div className="sound-row">
            <label htmlFor={`sound-${index}`}>Beat {index + 1}:</label>
            <select
                id={`sound-${index}`}
                value={metronomeManager.beatBarsManager.beats[index].beatSound.label}
                onChange={handleSelectedSoundsChange}
            >
                {SOUNDS.map((sound) => (
                    <option
                        key={`${sound.key}`}
                        value={sound.label}
                        onChange={handleSelectedSoundsChange}
                    >
                        {sound.label}
                    </option>
                ))}
            </select>
            {DEFAULT_SOUND_SETTINGS.map(setting => (
                <input
                    key={setting.key}
                    id={`${setting.key}-${index}`}
                    type="number"
                    placeholder={setting.label}
                    value={metronomeManager.beatBarsManager.beats[index].soundSettings.find(
                        beatSoundSetting => setting.key === beatSoundSetting.key).value
                    }
                    onChange={(e) => handleSoundSettingsChange(e, setting.key)}
                />
            ))}
        </div>
    )
});