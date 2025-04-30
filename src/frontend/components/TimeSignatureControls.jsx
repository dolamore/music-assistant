import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {ChangingButton} from "./UtilityComponents";
import {MAX_BEATS_AMOUNT, MIN_BEATS_AMOUNT} from "../vars/vars";

export default inject("metronomeManager")(observer(function TimeSignatureControls({metronomeManager}) {
    return (
        <div className="time-signature-controls-container container">
            <BeatsControlGroup metronomeManager={metronomeManager}/>
            <TimeSignatureInfo timeSignature={metronomeManager.beatBarsManager.timeSignature}/>
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
            <span>Beats</span>
            <div>
                <ChangingButton
                    id="increase-beats-button"
                    onClick={increaseBeats}
                    disabled={metronomeManager.beatBarsManager.beats.length >= MAX_BEATS_AMOUNT}
                    label="+"
                />
                <span id="beats-counter">{metronomeManager.beatBarsManager.beats.length}</span>
                <ChangingButton
                    id="decrease-beats-button"
                    onClick={decreaseBeats}
                    disabled={metronomeManager.beatBarsManager.beats.length <= MIN_BEATS_AMOUNT}
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
            <span>Notes</span>
            <div>
                <ChangingButton
                    id="increase-notes-button"
                    onClick={increaseNotes}
                    disabled={metronomeManager.beatBarsManager.beats.some(beat => beat.noteSettings.noteSize === 64)}
                    label="+"
                />
                <ChangingButton
                    id="decrease-notes-button"
                    onClick={decreaseNotes}
                    disabled={metronomeManager.beatBarsManager.beats.some(beat => beat.noteSettings.noteSize === 1)}
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