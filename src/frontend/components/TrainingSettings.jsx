import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {ControlsContainer} from "./UtilityComponents";
import {DEFAULT_LOOP_SKIP_PROBABILITY, DEFAULT_NOTE_SKIP_PROBABILITY} from "../vars/vars";

export default inject("metronomeManager")(observer(function TrainingSettings({metronomeManager}) {
    const trainingModeManager = metronomeManager.trainingModeManager;
    const {
        isTrainingMode, loopSkipProbability,
        handleLoopSkipProbabilityChange, noteSkipProbability, handleNoteSkipProbabilityChange
    } = trainingModeManager

    return (
        <div
            id="training-settings"
            className={`container
                       ${!isTrainingMode ? 'hidden' : ''}`}
        >
            <ControlsContainer
                label="Loop Skip Probability:"
                id="loop-skip-probability"
                defaultValue={DEFAULT_LOOP_SKIP_PROBABILITY}
                variable={loopSkipProbability}
                changeFunc={handleLoopSkipProbabilityChange}
                minLimit={0}
                maxLimit={100}
            />
            <ControlsContainer
                 label="Note Skip Probability:"
                 id="note-skip-probability"
                 defaultValue={DEFAULT_NOTE_SKIP_PROBABILITY}
                 variable={noteSkipProbability}
                 changeFunc={handleNoteSkipProbabilityChange}
                 minLimit={0}
                 maxLimit={100}
                 />
        </div>
    )
}));