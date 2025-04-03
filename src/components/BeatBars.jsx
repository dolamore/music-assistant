import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {DEFAULT_IS_TRIPLET, DEFAULT_NOTE_AMOUNT, DEFAULT_NOTE_SIZE, NOTE_AMOUNTS, NOTES} from "../vars.js";

export default inject("metronomeManager")(observer(function BeatBars({metronomeManager}) {
    const indices = metronomeManager.beatBarsManager.beats.map((_, i) => i);
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

        metronomeManager.beatBarsManager.beats[index].noteSettings =
            NOTES.find(note =>
                note.noteSize === noteSize && note.isTriplet === isTriplet);

        metronomeManager.elementsManager.updateTimeSignature();
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
                    selected={note.noteSize === DEFAULT_NOTE_SIZE && note.isTriplet === DEFAULT_IS_TRIPLET}
                >
                    {note.label}
                </option>
            ))}
        </select>
    )
});

const NoteAmountDropdown = observer(({ metronomeManager, index}) => {
    const handleChange = (e) => {
        metronomeManager.beatBarsManager.beats[index].noteAmounts = Number(e.target.value);
        metronomeManager.elementsManager.updateTimeSignature();
    }

    return (
            <select
                className="note-amount-dropdown"
                data-beat={index}
                onChange={handleChange}
            >
                {NOTE_AMOUNTS.map((amount, amountIndex) => (
                    <option
                        key={`amount-${amountIndex}`}
                        value={amount}
                        selected={amount === DEFAULT_NOTE_AMOUNT}
                    >
                        {amount}
                    </option>
                ))}
            </select>
    )
});