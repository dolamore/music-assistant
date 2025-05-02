import React, {ReactElement} from "react";
import {observer} from "mobx-react-lite";
import {DEFAULT_SOUND_SETTINGS} from "../vars/sound-settings/DEFAULT_SOUND_SETTINGS";
import {DEFAULT_SOUNDS} from "../vars/sounds/DEFAULT_SOUNDS";
import {InputField} from "./UtilityComponents";
import {MetronomeManagerInputType, SoundRowInputType} from "../models/ComponentsTypes";
import {SoundObj} from "../models/SoundObj";
import {SoundSetting} from "../models/SoundSetting";


export default (observer(function SettingsPanel({metronomeManager}: MetronomeManagerInputType): ReactElement {
    const indices: number[] = metronomeManager.beatBarsManager.beats.map((_, i: number): number => i);
    const numColumns: number = Object.keys(DEFAULT_SOUND_SETTINGS).length + 1; // +1 for oscillator
    return (
        <div id="settings-panel"
             className={`${metronomeManager.elementsManager.isSettingsPanelVisible ? '' : 'hidden'}
                        container`}>
            <h2>Sound Settings</h2>
            <div className="sound-settings-grid" style={{gridTemplateColumns: `150px repeat(${numColumns}, 1fr)`}}>
                <div className="sounds-settings-labels">
                    <span>Beat</span>
                    <span>Oscillator</span>
                    {DEFAULT_SOUND_SETTINGS.map((setting: SoundSetting): ReactElement => (
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
    )
}));

const SoundRow = observer(({metronomeManager, index}: SoundRowInputType) => {
    const beat = metronomeManager.beatBarsManager.beats[index];

    const handleSoundTypeChange = (e: any): void => {
        beat.updateSoundSetting('soundType', e.target.value)
    };


//TODO: узнать надо ли реально везде писать тип
    return (
        <div className="sound-row">
            <label htmlFor={`sound-${index}`}>Beat {index + 1}:</label>
            <select
                id={`sound-${index}`}
                value={beat.beatSound.instrument.soundType}
                onChange={handleSoundTypeChange}
            >
                {DEFAULT_SOUNDS.map((sound: SoundObj): ReactElement => (
                    <option
                        key={`${sound.key}`}
                        value={sound.key}
                    >
                        {sound.label}
                    </option>
                ))}
            </select>
            {beat.beatSound.instrument.soundSettings.map((setting: SoundSetting): ReactElement => (
                <InputField
                    key={setting.key}
                    id={`${setting.key}-${index}`}
                    inputVar={Number(setting.value)}
                    changeHandler={beat.beatSound.instrument.updateSoundSetting.bind(beat.beatSound.instrument, setting.key)}
                    defaultValue={Number(setting.defaultValue)}
                    minLimit={Number(setting.minValue)}
                    maxLimit={Number(setting.maxValue)}
                />
            ))}
        </div>
    );
});