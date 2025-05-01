import React, {ReactElement} from "react";
import {inject} from "mobx-react";
import {observer} from "mobx-react-lite";
import {MetronomeManagerInputType} from "../models/ComponentsTypes";

export default inject("metronomeManager")(observer(function LoopCounter({metronomeManager}: MetronomeManagerInputType): ReactElement {
    return (
        <div className="loop-counter-container container">
            <span>Loops played:</span>
            <div id="loop-counter">{metronomeManager.audioEngine.loopCount}</div>
        </div>
    );
}));