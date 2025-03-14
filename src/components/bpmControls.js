import React, {useState} from "react";
import {defaultInitialBPM} from "../vars.js";
import {handleInputBlur} from "../utils.js";

export default function BpmControls({metronomeManager}) {
    const [bpm, setBpm] = useState(metronomeManager.bpm);
    const handleBpmChange = (change) => {
        const newBpm = bpm + change;
        metronomeManager.handleBpmChange(newBpm, setBpm);
    };

    return (
        <div className="bpm-controls-container">
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
                    bpm={bpm}
                    setBpm={setBpm}
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
}

function BpmInput({bpm, setBpm, metronomeManager}) {
    return (
        <input
            type="number"
            id="bpm-input"
            value={bpm}
            onChange={(e) => metronomeManager.handleBpmChange(e.target.value, setBpm)}
            onBlur={() => handleInputBlur(bpm, setBpm, defaultInitialBPM, metronomeManager)}
            onKeyDown={(e) => metronomeManager.elementsManager.preventNonDigitInput(e)}
        />
    );
}

function BpmChangeButton({label, onClick, disabled}) {
    const buttonClass = disabled ? 'button-limit' : '';
    return (
        <button onClick={onClick} disabled={disabled} className={buttonClass}>
            {label}
        </button>
    );
}
