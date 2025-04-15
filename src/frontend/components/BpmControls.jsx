import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {BPM_MAX_LIMIT, BPM_MIN_LIMIT, DEFAULT_INITIAL_BPM} from "../vars/vars.js";
import {inject} from "mobx-react";
import {ChangingButton} from "./UtilityComponents.jsx";
import {preventNonDigitInput} from "../utils/utils.js";

export default inject("metronomeManager")(observer(function BpmControls({metronomeManager}) {
    const { bpm, handleBpmChange } = metronomeManager.audioEngine;
    const changeBpm = (change) => {
        handleBpmChange(bpm + change);
    };

    return (
        <div className="bpm-controls-container container">
            <label htmlFor="bpm-input">BPM:</label>
            <div className="bpm-controls">
                <ChangingButton
                    id="bpm-decrease-5"
                    label="-5"
                    onClick={() => changeBpm(-5)}
                    disabled={bpm <= BPM_MIN_LIMIT}
                />
                <ChangingButton
                    id="bpm-decrease-1"
                    label="-1"
                    onClick={() => changeBpm(-1)}
                    disabled={bpm <= BPM_MIN_LIMIT}
                />
                <BpmInput
                    bpm={bpm}
                    handleBpmChange={handleBpmChange}
                />
                <ChangingButton
                    id="bpm-increase-1"
                    label="+1"
                    onClick={() => changeBpm(1)}
                    disabled={bpm >= BPM_MAX_LIMIT}
                />
                <ChangingButton
                    id="bpm-increase-5"
                    label="+5"
                    onClick={() => changeBpm(5)}
                    disabled={bpm >= BPM_MAX_LIMIT}
                />
            </div>
        </div>
    );
}));

const BpmInput = observer(({bpm, handleBpmChange}) => {
    const [inputValue, setInputValue] = useState(bpm);

    useEffect(() => {
        setInputValue(bpm);
    }, [bpm]);

    const handleMouseEnter = () => {
    };

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
    };

    const handleBlur = () => {
        const newBpm = inputValue === '' ? DEFAULT_INITIAL_BPM : Number(inputValue);
        handleBpmChange(newBpm);
        setInputValue(newBpm);
    };

    return (
        <input
            type="number"
            id="bpm-input"
            value={inputValue}
            onMouseEnter={handleMouseEnter}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => preventNonDigitInput(e)}
        />
    );
});
