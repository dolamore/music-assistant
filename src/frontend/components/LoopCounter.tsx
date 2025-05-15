import React, {ReactElement} from "react";
import {observer} from "mobx-react-lite";
import {MetronomeManagerInputType} from "../models/ComponentsTypes";

export default observer(function LoopCounter({
                                                 metronomeManager,
                                             }: MetronomeManagerInputType): ReactElement {
    return (
        <div className="loop-counter-container container">
            <span>Loops played:</span>
            <div id="loop-counter" data-testid="loop-counter">{
                metronomeManager.audioEngine.loopCount}
            </div>
        </div>
    );
});
