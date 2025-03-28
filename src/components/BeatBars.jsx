import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {NOTES} from "../vars.js";

export default inject("metronomeManager")(observer(function BeatBars({metronomeManager}) {
    const indices = Array.from({length: metronomeManager.beatBarsManager.numberOfBeats},
        (_, i) => i + 1);
    return (
        <div id="beat-container"
             className={`beat-container
                         container
                         ${!metronomeManager.visualEffectsManager.areBeatBarsVisible ? 'hidden' : ''}`}
        >
            {indices.map(index => (
                <BeatRow key={`beat-row-${index}`} metronomeManager={metronomeManager} index={index}/>
            ))}
        </div>
    )
}));

const BeatRow = observer(({metronomeManager, index}) => {
    return (
        <div className="beat-row">
            <div className="beat" data-beat={index} data-sound="1"></div>
            <NoteSizeDropdown metronomeManager={metronomeManager} index={index}/>
            <NoteAmountDropdown metronomeManager={metronomeManager} index={index}/>
        </div>
    )
});

const NoteSizeDropdown = observer(({metronomeManager, index}) => {
    const handleChange = (e) => {
        const selection = e.target.selectedOptions[0];
        const noteSize = Number(selection.getAttribute('data-note-size'));
        const isTriplet = selection.getAttribute('data-is-triplet') === 'true';

        metronomeManager.beatBarsManager.noteAttributes.noteSettings[index] =
            NOTES.find(note =>
                note.noteSize === noteSize && note.isTriplet === isTriplet);
    }

    return (
        <select
            className="note-size-dropdown"
            data-beat={index}
            onChange={handleChange}
        >
            {NOTES.map((note, noteIndex) => (
                <option
                    key={`note-${noteIndex}`}
                    data-note-size={note.noteSize}
                    data-is-triplet={note.isTriplet.toString()}
                >
                    {note.label}
                </option>
            ))}
        </select>
    )
});

const NoteAmountDropdown = observer(({metronomeManager, index}) => {
    return (
        <label>
            <select className="note-amount-dropdown" data-beat={index}>
                <option value="1" selected>1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
            </select>
        </label>
    )
});