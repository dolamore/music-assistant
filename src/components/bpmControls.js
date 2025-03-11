export default function BpmControls({metronomeManager}) {
    return (
        <div className="bpm-controls">
            <IncreaseBpmButton/>
            <IncreaseFiveBpmButton/>
            <BpmInput/>
            <DecreaseFiveBpmButton/>
            <DecreaseBpmButton/>
        </div>
    )
}

function IncreaseBpmButton(metronomeManager) {
    return (
        <button onClick={() => metronomeManager.handleBpmChange(1)}>+1</button>
    )
}

function BpmInput({metronomeManger}) {
    return (
        <input type="number" id="bpm-input" value={metronomeManger.bpm}
               onChange={metronomeManger.handleNewBPM}
               onBlur={metronomeManger.elementsManager.handleBpmInputChanges}/>
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