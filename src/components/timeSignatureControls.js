import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function TimeSignatureControls({metronomeManager}) {
    return (
    <div className="time-signature-controls-container container">
        <div className="control-group">
            <label>Beats</label>
            <div>
                <button id="increase-beats-button">+</button>
                <span id="beats-counter"></span>
                <button id="decrease-beats-button">-</button>
            </div>
        </div>
        <div className="time-signature">
            <span>Time Signature:</span>
            <div id="time-signature" className="signature-box">4/4</div>
        </div>
        <div className="control-group">
            <label>Notes</label>
            <div>
                <button id="increase-notes-button">+</button>
                <button id="decrease-notes-button">-</button>
            </div>
        </div>
    </div>
    );
}));