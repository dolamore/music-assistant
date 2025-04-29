import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {ChangingButton, InputField} from "./UtilityComponents";
import {DEFAULT_LOOP_SKIP_PROBABILITY, DEFAULT_NOTE_SKIP_PROBABILITY} from "../vars/vars";

export default inject("metronomeManager")(observer(function TrainingSettings({metronomeManager}) {
    const trainingModeManager = metronomeManager.trainingModeManager;
    const {isTrainingMode, loopSkipProbability,
        handleLoopSkipProbabilityChange, noteSkipProbability, handleNoteSkipProbabilityChange} = trainingModeManager

    return (
        <div
            id="training-settings"
            className={`container
                       ${!isTrainingMode ? 'hidden' : ''}`}
        >
            <ProbabilityContainer
                label="Loop Skip"
                id="loop-skip-probability"
                defaultValue={DEFAULT_LOOP_SKIP_PROBABILITY}
                probability={loopSkipProbability}
                changeFunction={handleLoopSkipProbabilityChange}
            />
           <ProbabilityContainer
                label="Note Skip"
                id="note-skip-probability"
                defaultValue={DEFAULT_NOTE_SKIP_PROBABILITY}
                probability={noteSkipProbability}
                changeFunction={handleNoteSkipProbabilityChange}
            />
        </div>
    )
}));

const ProbabilityContainer = observer(({label, id, defaultValue, probability, changeFunction}) => {
    return (
        <div
            id={`${id}-controls-container`}
            className="probability-controls-container controls-container container"
        >
            <label htmlFor={`${id}-input`}>{label}:</label>
            <ProbabilityControls
                id={id}
                probability={probability}
                changeFunction={changeFunction}
                defaultValue={defaultValue}
            />
        </div>
    );
});

const ProbabilityControls = observer(({id, probability, changeFunction, defaultValue}) => {

    return (
        <div className="probability-controls">
            <ChangingButton
                id={`decrease-${id}-5-button`}
                onClick={() => changeFunction(probability - 5)}
                label="-5"
                disabled={probability <= 0}
            />
            <ChangingButton
                id={`decrease-${id}-button`}
                onClick={() => changeFunction(probability - 1)}
                label="-1"
                disabled={probability <= 0}
            />
            <InputField
                id={`${id}-input`}
                inputVar={probability}
                changeHandler={changeFunction}
                defaultValue={defaultValue}
                minLimit={0}
                maxLimit={100}
            />
            <ChangingButton
                id={`increase-${id}-button`}
                onClick={() => changeFunction(probability + 1)}
                label="+1"
                disabled={probability >= 100}
            />
            <ChangingButton
                id={`increase-${id}-5-button`}
                onClick={() => changeFunction(probability + 5)}
                label="+5"
                disabled={probability >= 100}
            />
        </div>
    );
});


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