import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function TimeSignatureControls({metronomeManager}) {
    return (
        <div className="time-signature-controls-container container">
            <BeatsControlGroup metronomeManager={metronomeManager}/>
            <TimeSignatureInfo timeSignature={metronomeManager.elementsManager.timeSignature}/>
            <NotesControlGroup disabled={metronomeManager.elementsManager.increaseNoteButtonLimit}/>
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
                <button
                    id="increase-beats-button"
                    onClick={increaseBeats}
                    disabled={metronomeManager.buttonsManager.increaseBeatsButtonLimit}
                    className={metronomeManager.buttonsManager.increaseBeatsButtonLimit ? 'button-limit' : ''}
                >
                    +
                </button>
                <span id="beats-counter">{metronomeManager.beatBarsManager.numberOfBeats}</span>
                <button
                    id="decrease-beats-button"
                    onClick={decreaseBeats}
                    disabled={metronomeManager.buttonsManager.decreaseBeatsButtonLimit}
                    className={metronomeManager.buttonsManager.decreaseBeatsButtonLimit ? 'button-limit' : ''}
                >
                    -
                </button>
            </div>
        </div>
    );
});

const NotesControlGroup = observer(({disabled}) => {
    return (
        <div className="time-signature-control-group">
            <label>Notes</label>
            <div>
                <button
                    id="increase-notes-button"
                    disabled={disabled}
                    className={disabled ? 'button-limit' : ''}
                >
                    +
                </button>
                <button
                    id="decrease-notes-button"

                >
                    -
                </button>
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