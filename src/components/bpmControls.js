import React, {useState} from "react";
import {defaultInitialBPM} from "../vars.js";
import {handleInputBlur} from "../utils.js";

export default function BpmControls({metronomeManager}) {
    const [bpm, setBpm] = useState(metronomeManager.bpm);

    return (
        <div className="bpm-controls-container">
            <label htmlFor="bpm-input">BPM:</label>
            <div className="bpm-controls">
                <DecreaseFiveBpmButton bpm={bpm} setBpm={setBpm} metronomeManager={metronomeManager}/>
                <DecreaseBpmButton bpm={bpm} setBpm={setBpm} metronomeManager={metronomeManager}/>
                <BpmInput bpm={bpm} setBpm={setBpm} metronomeManager={metronomeManager}/>
                <IncreaseBpmButton bpm={bpm} setBpm={setBpm} metronomeManager={metronomeManager}/>
                <IncreaseFiveBpmButton bpm={bpm} setBpm={setBpm} metronomeManager={metronomeManager}/>
            </div>
        </div>
    )
}

function IncreaseBpmButton({bpm, setBpm, metronomeManager}) {
    return (
        <button
            onClick={() => metronomeManager.handleBpmChange(bpm + 1, setBpm)}
            disabled={metronomeManager.bpmMaxLimitReached}
            className={`${metronomeManager.bpmMaxLimitReached ? 'button-limit' : ''}`}
        >
            +1
        </button>
    )
}

function BpmInput({bpm, setBpm, metronomeManager}) {
    return (
        <input
            type="number"
            id="bpm-input"
            value={bpm}
            onChange={(e) =>
                metronomeManager.handleBpmChange(parseInt(e.target.value, 10), setBpm)}
            onBlur={() => handleInputBlur(bpm, setBpm, defaultInitialBPM, metronomeManager)}
            onKeyDown={() => metronomeManager.elementsManager.preventNonDigitInput}
        />
    );
}

function DecreaseBpmButton({bpm, setBpm, metronomeManager}) {
    return (
        <button
            onClick={() => metronomeManager.handleBpmChange(bpm - 1, setBpm)}
            disabled={metronomeManager.bpmMinLimitReached}
            className={`${metronomeManager.bpmMinLimitReached ? 'button-limit' : ''}`}
        >
            -1
        </button>
    )
}

function IncreaseFiveBpmButton({bpm, setBpm, metronomeManager}) {
    return (
        <button
            onClick={() => metronomeManager.handleBpmChange(bpm + 5, setBpm)}
            disabled={metronomeManager.bpmMaxLimitReached}
            className={`${metronomeManager.bpmMaxLimitReached ? 'button-limit' : ''}`}
        >
            +5
        </button>
    )
}

function DecreaseFiveBpmButton({bpm, setBpm, metronomeManager}) {
    return (
        <button
            onClick={() => metronomeManager.handleBpmChange(bpm - 5, setBpm)}
            disabled={metronomeManager.bpmMinLimitReached}
            className={`${metronomeManager.bpmMinLimitReached ? 'button-limit' : ''}`}
        >
            -5
        </button>
    )
}
