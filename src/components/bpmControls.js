import React, {useState} from "react";
import {bpmMaxLimit, bpmMinLimit, defaultInitialBPM} from "../vars.js";
import {handleInputBlur} from "../utils.js";

export default function BpmControls({metronomeManager}) {
    return (
        <div className="bpm-controls-container">
            <label htmlFor="bpm-input">BPM:</label>
            <div className="bpm-controls">
                <DecreaseFiveBpmButton metronomeManager={metronomeManager}/>
                <DecreaseBpmButton metronomeManager={metronomeManager}/>
                <BpmInput metronomeManager={metronomeManager}/>
                <IncreaseBpmButton metronomeManager={metronomeManager}/>
                <IncreaseFiveBpmButton metronomeManager={metronomeManager}/>
            </div>
        </div>
    )
}

function IncreaseBpmButton({metronomeManager}) {
    return (
        <button
            onClick={() => metronomeManager.handleBpmChange(1)}
            disabled={metronomeManager.bpmMaxLimitReached}
            className={`${metronomeManager.bpmMaxLimitReached ? 'button-limit' : ''}`}
        >
            +1
        </button>
    )
}

function BpmInput({metronomeManager}) {
    const [bpm, setBpm] = useState(metronomeManager.bpm);

    const handleChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) { // Allow only numeric input
            const newBpm = parseInt(value, 10);
            if (newBpm >= bpmMinLimit && newBpm <= bpmMaxLimit) { // Restrict value between 1 and 500
                setBpm(newBpm);
                metronomeManager.handleNewBPM(newBpm);
            } else if (value === "") {
                setBpm(value); // Allow empty input temporarily
            }
        }
    };

    return (
        <input
            type="number"
            id="bpm-input"
            value={bpm}
            onChange={handleChange}
            onBlur={() => handleInputBlur(bpm, setBpm, defaultInitialBPM, handleChange)}
            min={bpmMinLimit}
            max={bpmMaxLimit}
        />
    );
}

function DecreaseBpmButton({metronomeManager}) {
    return (
        <button
            onClick={() => metronomeManager.handleBpmChange(-1)}
            disabled={metronomeManager.bpmMinLimitReached}
            className={`${metronomeManager.bpmMinLimitReached ? 'button-limit' : ''}`}
        >
            -1
        </button>
    )
}

function IncreaseFiveBpmButton({metronomeManager}) {
    return (
        <button
            onClick={() => metronomeManager.handleBpmChange(-1)}
            disabled={metronomeManager.bpmMinLimitReached}
            className={`${metronomeManager.bpmMinLimitReached ? 'button-limit' : ''}`}
        >
            +5
        </button>
    )
}

function DecreaseFiveBpmButton({metronomeManager}) {
    return (
        <button
            onClick={() => metronomeManager.handleBpmChange(-1)}
            disabled={metronomeManager.bpmMinLimitReached}
            className={`${metronomeManager.bpmMinLimitReached ? 'button-limit' : ''}`}
        >
            -5
        </button>
    )
}

/**
 elements.bpmInput.addEventListener('input', (e) => {
 this.metronomeManager.handleNewBPM(parseInt(e.target.value, 10));
 });

 elements.bpmInput.addEventListener('blur', () => this.handleBpmInputChanges());
 */