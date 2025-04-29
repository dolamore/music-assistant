import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {ChangingButton, ControlsContainer, InputField} from "./UtilityComponents";
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
                 probability={noteSkipProbability}
                 changeFunc={handleNoteSkipProbabilityChange}
                 minLimit={0}
                 maxLimit={100}
                 />
        </div>
    )
}));

// <div id="training-settings" className="hidden container">
//     <div id="loop-skip-probability-container container" className="probability-container">
//         <label htmlFor="loop-skip-probability-input">Loop Skip:</label>
//         <div className="probability-controls">
//             <button id="decrease-loop-skip-probability-5-button">-5</button>
//             <button id="decrease-loop-skip-probability-button">-1</button>
//             <input
//                 type="number"
//                 id="loop-skip-probability-input"
//                 value={metronomeManager.loopSkipProbability}
//                 onChange={(e) => metronomeManager.setLoopSkipProbability(Number(e.target.value))}
//                 min="0"
//                 max="100"
//             />
//             <button id="increase-loop-skip-probability-button">+1</button>
//             <button id="increase-loop-skip-probability-5-button">+5</button>
//         </div>
//     </div>
//     <div id="note-skip-probability-container container" className="probability-container">
//         <label htmlFor="note-skip-probability-input">Note Skip:</label>
//         <div className="probability-controls">
//             <button id="decrease-note-skip-probability-5-button">-5</button>
//             <button id="decrease-note-skip-probability-button">-1</button>
//             <input
//                 type="number"
//                 id="note-skip-probability-input"
//                 value={metronomeManager.noteSkipProbability}
//                 onChange={(e) => metronomeManager.setNoteSkipProbability(Number(e.target.value))}
//                 min="0"
//                 max="100"
//             />
//             <button id="increase-note-skip-probability-button">+1</button>
//             <button id="increase-note-skip-probability-5-button">+5</button>
//         </div>
//     </div>
// </div>

//<input type="number" id="loop-skip-probability-input" value="25" min="0" max="100"/>
//   <input type="number" id="note-skip-probability-input" value="0" min="0" max="100"/>