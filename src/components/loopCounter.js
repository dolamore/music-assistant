import React from "react";
import {inject} from "mobx-react";
import {observer} from "mobx-react-lite";

export default inject("metronomeManager")(observer(function LoopCounter({metronomeManager}) {
    return (
        <div className="loop-counter-container container">
            <label htmlFor="loop-counter">Loops played:</label>
            <div id="loop-counter">{metronomeManager.loopCount}</div>
        </div>
    );
}));