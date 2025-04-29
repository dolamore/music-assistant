import React from "react";
import {observer} from "mobx-react-lite";
import {BPM_MAX_LIMIT, BPM_MIN_LIMIT, DEFAULT_INITIAL_BPM} from "../vars/vars";
import {inject} from "mobx-react";
import {ControlsContainer} from "./UtilityComponents";

export default inject("metronomeManager")(observer(function BpmControls({metronomeManager}) {
    const {bpm, handleBpmChange} = metronomeManager.audioEngine;

    return (
        <ControlsContainer
            id={"bpm"}
            changeFunc={handleBpmChange}
            variable={bpm}
            minLimit={BPM_MIN_LIMIT}
            maxLimit={BPM_MAX_LIMIT}
            defaultValue={DEFAULT_INITIAL_BPM}
            label={"BPM:"}
        />
    );
}));