import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {NOTE_AMOUNTS, NOTES} from "../vars.js";

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
    const beat = metronomeManager.beatBarsManager.beats[index];

    return (
        <div className="beat-row">
            <div className="beat" data-beat={index} data-sound="1"></div>
            <NoteSizeDropdown metronomeManager={metronomeManager} beat={beat}/>
            <NoteAmountDropdown metronomeManager={metronomeManager} beat={beat}/>
        </div>
    )
});

const NoteSizeDropdown = observer(({metronomeManager, beat}) => {
    const handleChange = (e) => {
        const [noteSizeStr, isTripletStr] = e.target.value.split("-");
        const noteSize = Number(noteSizeStr);
        const isTriplet = isTripletStr === "true";

        beat.noteSettings =
            NOTES.find(note =>
                note.noteSize === noteSize && note.isTriplet === isTriplet);

        metronomeManager.elementsManager.updateTimeSignature();
    }

    const currentValue = `${beat.noteSettings.noteSize}-${beat.noteSettings.isTriplet}`;

    return (
        <select
            className="note-size-dropdown"
            onChange={handleChange}
            value={currentValue}
        >
            {NOTES.map((note, noteIndex) => (
                <option
                    key={`note-${noteIndex}`}
                    value={`${note.noteSize}-${note.isTriplet}`}
                >
                    {note.label}
                </option>
            ))}
        </select>
    )
});

const NoteAmountDropdown = observer(({ metronomeManager, beat}) => {
    const handleChange = (e) => {
        beat.noteAmounts = Number(e.target.value);
        metronomeManager.elementsManager.updateTimeSignature();
    }

    return (
            <select
                className="note-amount-dropdown"
                onChange={handleChange}
                value={beat.noteAmounts}
            >
                {NOTE_AMOUNTS.map((amount, amountIndex) => (
                    <option
                        key={`amount-${amountIndex}`}
                        value={amount}
                    >
                        {amount}
                    </option>
                ))}
            </select>
    )
});