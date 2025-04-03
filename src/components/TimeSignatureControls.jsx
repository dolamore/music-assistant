import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {ChangingButton} from "./UtilityComponents.jsx";

export default inject("metronomeManager")(observer(function TimeSignatureControls({metronomeManager}) {
    return (
        <div className="time-signature-controls-container container">
            <BeatsControlGroup metronomeManager={metronomeManager}/>
            <TimeSignatureInfo timeSignature={metronomeManager.elementsManager.timeSignature}/>
            <NotesControlGroup metronomeManager={metronomeManager}/>
        </div>
    );
}));

const BeatsControlGroup = observer(({metronomeManager}) => {
    const increaseBeats = () => {
        metronomeManager.beatBarsManager.increaseBeats();
    }

    const decreaseBeats = () => {
        metronomeManager.beatBarsManager.decreaseBeats();
    }

    return (
        <div className="time-signature-control-group">
            <label>Beats</label>
            <div>
                <ChangingButton
                    id="increase-beats-button"
                    onClick={increaseBeats}
                    disabled={metronomeManager.buttonsManager.increaseBeatsButtonLimit}
                    label="+"
                />
                <span id="beats-counter">{metronomeManager.beatBarsManager.beats.length}</span>
                <ChangingButton
                    id="decrease-beats-button"
                    onClick={decreaseBeats}
                    disabled={metronomeManager.buttonsManager.decreaseBeatsButtonLimit}
                    label="-"
                />
            </div>
        </div>
    );
});

const NotesControlGroup = observer(({metronomeManager}) => {
    const decreaseNotes = () => {
        metronomeManager.beatBarsManager.decreaseNotes();
    }

    const increaseNotes = () => {
        metronomeManager.beatBarsManager.increaseNotes();
    }
    return (
        <div className="time-signature-control-group">
            <label>Notes</label>
            <div>
                <ChangingButton
                    id="increase-notes-button"
                    onClick={increaseNotes}
                    disabled={metronomeManager.buttonsManager.increaseNoteButtonLimit}
                    label="+"
                />
                <ChangingButton
                    id="decrease-notes-button"
                    onClick={decreaseNotes}
                    disabled={metronomeManager.buttonsManager.decreaseNoteButtonLimit}
                    label="-"
                />
            </div>
        </div>
    );
});

const TimeSignatureInfo = observer(({timeSignature}) => {
    const {numerator, tactSize} = timeSignature;
    return (
        <div className="time-signature-info">
            <span>Time Signature:</span>
            <div
                id="time-signature"
                className="signature-box"
            >
                {`${numerator}/${tactSize}`}
            </div>
        </div>
    );
});