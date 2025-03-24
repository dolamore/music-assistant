import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {bpmMaxLimit, bpmMinLimit, defaultInitialBPM} from "../vars.js";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function BpmControls({metronomeManager}) {
    const handleBpmChange = (change) => {
        metronomeManager.handleBpmChange(metronomeManager.bpm + change);
    };

    return (
        <div className="bpm-controls-container container">
            <label htmlFor="bpm-input">BPM:</label>
            <div className="bpm-controls">
                <BpmChangeButton
                    label="-5"
                    onClick={() => handleBpmChange(-5)}
                    disabled={metronomeManager.bpmMinLimitReached}
                />
                <BpmChangeButton
                    label="-1"
                    onClick={() => handleBpmChange(-1)}
                    disabled={metronomeManager.bpmMinLimitReached}
                />
                <BpmInput
                    metronomeManager={metronomeManager}
                />
                <BpmChangeButton
                    label="+1"
                    onClick={() => handleBpmChange(1)}
                    disabled={metronomeManager.bpmMaxLimitReached}
                />
                <BpmChangeButton
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
        if (intValue > bpmMaxLimit) {
            value = bpmMaxLimit;
        } else if (intValue < bpmMinLimit) {
            value = bpmMinLimit;
        }
        setInputValue(value);
        metronomeManager.handleBpmChange(value);
    };

    const handleBlur = () => {
        const newBpm = inputValue === '' ? defaultInitialBPM : Number(inputValue);
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

function BpmChangeButton({label, onClick, disabled}) {
    return <button
        onClick={onClick}
        disabled={disabled}
        className={disabled ? 'button-limit' : ''}
    >
        {label}
    </button>;
}
