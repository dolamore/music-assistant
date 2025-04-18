import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {DEFAULT_SOUND_SETTINGS} from "../vars/sound-settings/DEFAULT_SOUND_SETTINGS.js";
import {DEFAULT_SOUNDS} from "../vars/sounds/DEFAULT_SOUNDS.ts";


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
    const beat = metronomeManager.beatBarsManager.beats[index];

    const handleSelectedSoundsChange = (e) => {
        beat.updateSoundSetting('oscillatorType', e.target.value)
    };

    const handleSoundSettingsChange = (e, key) => {
        const newValue = Number(e.target.value);
        beat.beatSound.instrument.updateSoundSetting(key, newValue);
    };
    console.log(metronomeManager.beatBarsManager.beats[0].beatSound.instrument.soundSettings === metronomeManager.beatBarsManager.beats[1].beatSound.instrument.soundSettings);
    return (
        <div className="sound-row">
            <label htmlFor={`sound-${index}`}>Beat {index + 1}:</label>
            <select
                id={`sound-${index}`}
                value={beat.beatSound.key}
                onChange={handleSelectedSoundsChange}
            >
                {DEFAULT_SOUNDS.map((sound) => (
                    <option
                        key={`${sound.key}`}
                        value={sound.key}
                    >
                        {sound.label}
                    </option>
                ))}
            </select>
            {beat.beatSound.instrument.soundSettings.map(setting => (
                <input
                    key={setting.key}
                    id={`${setting.key}-${index}`}
                    type="number"
                    placeholder={setting.label}
                    value={beat.beatSound.instrument.soundSettings.find(
                        instrumentSoundSetting => setting.key === instrumentSoundSetting.key).value
                    }
                    onChange={(e) => handleSoundSettingsChange(e, setting.key)}
                />
            ))}
        </div>
    )
});