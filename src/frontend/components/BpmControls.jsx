import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {BPM_MAX_LIMIT, BPM_MIN_LIMIT, DEFAULT_INITIAL_BPM} from "../../shared/vars.js";
import {inject} from "mobx-react";
import {ChangingButton} from "./UtilityComponents.jsx";

export default inject("metronomeManager")(observer(function BpmControls({metronomeManager}) {
    const handleBpmChange = (change) => {
        metronomeManager.handleBpmChange(metronomeManager.bpm + change);
    };

    return (
        <div className="bpm-controls-container container">
            <label htmlFor="bpm-input">BPM:</label>
            <div className="bpm-controls">
                <ChangingButton
                    id="bpm-decrease-5"
                    label="-5"
                    onClick={() => handleBpmChange(-5)}
                    disabled={metronomeManager.bpmMinLimitReached}
                />
                <ChangingButton
                    id="bpm-decrease-1"
                    label="-1"
                    onClick={() => handleBpmChange(-1)}
                    disabled={metronomeManager.bpmMinLimitReached}
                />
                <BpmInput
                    metronomeManager={metronomeManager}
                />
                <ChangingButton
                    id="bpm-increase-1"
                    label="+1"
                    onClick={() => handleBpmChange(1)}
                    disabled={metronomeManager.bpmMaxLimitReached}
                />
                <ChangingButton
                    id="bpm-increase-5"
                    label="+5"
                    onClick={() => handleBpmChange(5)}
                    disabled={metronomeManager.bpmMaxLimitReached}
                />
            </div>
        </div>
    );
}));

const BpmInput = observer(({metronomeManager}) => {
    const [inputValue, setInputValue] = useState(metronomeManager.bpm);

    useEffect(() => {
        setInputValue(metronomeManager.bpm);
    }, [metronomeManager.bpm]);


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
        metronomeManager.handleBpmChange(value);
    };

    const handleBlur = () => {
        const newBpm = inputValue === '' ? DEFAULT_INITIAL_BPM : Number(inputValue);
        metronomeManager.handleBpmChange(newBpm);
        setInputValue(metronomeManager.bpm);
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
