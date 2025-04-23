import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function TrainingSettings({metronomeManager}) {
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