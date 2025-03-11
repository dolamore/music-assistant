import React from "react";
import {bpmMaxLimit, defaultInitialBPM} from "../vars.js";

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
    return (
        <input type="number" id="bpm-input" value={metronomeManager.bpm}
               onChange={
                   (e) => {
                       console.log(e);
                       metronomeManager.handleNewBPM(e.target.value)
                   }
               }
               onBlur={
                   () =>
                       metronomeManager.elementsManager.handleBpmInputChanges(metronomeManager.bpm, defaultInitialBPM)
               }/>
    )
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