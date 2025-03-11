import React from "react";

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

function IncreaseBpmButton(metronomeManager) {
    return (
        <button onClick={() => metronomeManager.handleBpmChange(1)}>+1</button>
    )
}

function BpmInput({metronomeManager}) {
    return (
        <input type="number" id="bpm-input" value={metronomeManager.bpm}
               onChange={metronomeManager.handleNewBPM}
               onBlur={metronomeManager.elementsManager.handleBpmInputChanges}/>
    )
}

function DecreaseBpmButton(metronomeManager) {
    return (
        <button onClick={() => metronomeManager.handleBpmChange(-1)}>-1</button>
    )
}

function IncreaseFiveBpmButton(metronomeManager) {
    return (
        <button onClick={() => metronomeManager.handleBpmChange(5)}>+5</button>
    )
}

function DecreaseFiveBpmButton(metronomeManager) {
    return (
        <button onClick={() => metronomeManager.handleBpmChange(-5)}>-5</button>
    )
}

/**
 elements.bpmInput.addEventListener('input', (e) => {
 this.metronomeManager.handleNewBPM(parseInt(e.target.value, 10));
 });

 elements.bpmInput.addEventListener('blur', () => this.handleBpmInputChanges());
 */