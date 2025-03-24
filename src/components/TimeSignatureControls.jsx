import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function TimeSignatureControls({metronomeManager}) {
    return (
        <div className="time-signature-controls-container container">
            <BeatsControlGroup metronomeManager={metronomeManager}/>
            <TimeSignatureInfo />
            <NotesControlGroup/>
        </div>
    );
}));

const BeatsControlGroup = observer(({metronomeManager}) => {
    const increaseBeats = () => {
        metronomeManager.beatBarsManager.increaseBeat();
    }

    const decreaseBeats = () => {
        metronomeManager.beatBarsManager.numberOfBeats--;
    }

    return (
        <div className="time-signature-control-group">
            <label>Beats</label>
            <div>
                <button id="increase-beats-button" onClick={increaseBeats}>+</button>
                <span id="beats-counter">{metronomeManager.beatBarsManager.numberOfBeats}</span>
                <button id="decrease-beats-button" onClick={decreaseBeats}>-</button>
            </div>
        </div>
    );
});

const NotesControlGroup = observer(({metronomeManager}) => {
    return (
        <div className="time-signature-control-group">
            <label>Notes</label>
            <div>
                <button id="increase-notes-button">+</button>
                <button id="decrease-notes-button">-</button>
            </div>
        </div>
    );
});

const TimeSignatureInfo = observer(({metronomeManager}) => {
    return (
        <div className="time-signature-info">
            <span>Time Signature:</span>
            <div id="time-signature" className="signature-box">4/4</div>
        </div>
    );
});