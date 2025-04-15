import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {BPM_MAX_LIMIT, BPM_MIN_LIMIT, DEFAULT_INITIAL_BPM} from "../vars/vars.js";
import {inject} from "mobx-react";
import {ChangingButton} from "./UtilityComponents.jsx";

export default inject("metronomeManager")(observer(function BpmControls({metronomeManager}) {
    const handleBpmChange = (change) => {
        metronomeManager.audioEngine.handleBpmChange(metronomeManager.audioEngine.bpm + change);
    };

    return (
        <div className="bpm-controls-container container">
            <label htmlFor="bpm-input">BPM:</label>
            <div className="bpm-controls">
                <ChangingButton
                    id="bpm-decrease-5"
                    label="-5"
                    onClick={() => handleBpmChange(-5)}
                    disabled={metronomeManager.audioEngine.bpm <= BPM_MIN_LIMIT}
                />
                <ChangingButton
                    id="bpm-decrease-1"
                    label="-1"
                    onClick={() => handleBpmChange(-1)}
                    disabled={metronomeManager.audioEngine.bpm <= BPM_MIN_LIMIT}
                />
                <BpmInput
                    metronomeManager={metronomeManager}
                />
                <ChangingButton
                    id="bpm-increase-1"
                    label="+1"
                    onClick={() => handleBpmChange(1)}
                    disabled={metronomeManager.audioEngine.bpm >= BPM_MAX_LIMIT}
                />
                <ChangingButton
                    id="bpm-increase-5"
                    label="+5"
                    onClick={() => handleBpmChange(5)}
                    disabled={metronomeManager.audioEngine.bpm >= BPM_MAX_LIMIT}
                />
            </div>
        </div>
    );
}));

const BpmInput = observer(({metronomeManager}) => {
    const [inputValue, setInputValue] = useState(metronomeManager.audioEngine.bpm);

    useEffect(() => {
        setInputValue(metronomeManager.audioEngine.bpm);
    }, [metronomeManager.audioEngine.bpm]);


    const handleChange = (e) => {
        let value = e.target.value;
        // Remove leading zeros
        if (/^0\d/.test(value)) {
            value = value.replace(/^0+/, '');
        }
        // Limit the value to the allowable BPM range
        const intValue = parseInt(value, 10);
        if (intValue > BPM_MAX_LIMIT) {
            value = BPM_MAX_LIMIT;
        } else if (intValue < BPM_MIN_LIMIT) {
            value = BPM_MIN_LIMIT;
        }
        setInputValue(value);
        metronomeManager.audioEngine.handleBpmChange(value);
    };

    const handleBlur = () => {
        const newBpm = inputValue === '' ? DEFAULT_INITIAL_BPM : Number(inputValue);
        metronomeManager.audioEngine.handleBpmChange(newBpm);
        setInputValue(metronomeManager.audioEngine.bpm);
    };

    return (
        <input
            type="number"
            id="bpm-input"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => metronomeManager.elementsManager.preventNonDigitInput(e)}
        />
    );
});
