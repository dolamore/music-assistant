import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {NOTE_AMOUNTS, NOTES} from "../vars/vars.js";
import {uiState} from "../states/UIState.js";

export default inject("metronomeManager")(observer(function BeatBars({metronomeManager}) {
    const indices = metronomeManager.beatBarsManager.beats.map((_, i) => i);
    return (
        <div id="beat-container"
             className={`beat-container
                         container
                         ${!metronomeManager.visualEffectsManager.areBeatBarsVisible ? 'hidden' : ''}`}
        >
            {indices.map(index => (
                <BeatRow key={`beat-row-${index}`} metronomeManager={metronomeManager} index={index} uiState={uiState}/>
            ))}
        </div>
    )
}));

const BeatRow = observer(({metronomeManager, index, uiState}) => {
    const beat = metronomeManager.beatBarsManager.beats[index];
    const isPlaying = uiState.currentPlayingBeatIndex === index;
//TODO: добавить изменение саунда
    return (
        <div className="beat-row">
            <div
                className={`beat ${isPlaying ? 'playing' : ''}`}
                data-beat={index}
                data-sound="1"
            ></div>
            <NoteSizeDropdown metronomeManager={metronomeManager} beat={beat} index={index}/>
            <NoteAmountDropdown metronomeManager={metronomeManager} beat={beat} index={index}/>
        </div>
    )
});
//TODO: переписать с учётом наличия поля note
const NoteSizeDropdown = observer(({metronomeManager, beat, index}) => {
    const handleChange = (e) => {
        const [noteSizeStr, isTripletStr] = e.target.value.split("-");
        const noteSize = Number(noteSizeStr);
        const isTriplet = isTripletStr === "true";

        beat.noteSettings =
            NOTES.find(
                note => note.noteSize === noteSize && note.isTriplet === isTriplet);
        metronomeManager.updateMetronome();
    }

    const currentValue = `${beat.noteSettings.noteSize}-${beat.noteSettings.isTriplet}`;

    return (
        <select
            id={`note-size-dropdown-${index}`}
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

const NoteAmountDropdown = observer(({metronomeManager, beat, index}) => {
    const handleChange = (e) => {
        beat.noteAmounts = Number(e.target.value);

        metronomeManager.updateMetronome();
        const newSeq = metronomeManager.audioEngine.beatSequence;
        const oldSeq = metronomeManager.audioEngine.beatSequence;
        console.log(oldSeq === newSeq);
        console.log(oldSeq);
        console.log(newSeq);
    }

    return (
        <select
            id={`note-amount-dropdown-${index}`}
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