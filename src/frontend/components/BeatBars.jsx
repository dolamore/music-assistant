import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {NOTE_AMOUNTS, NOTES} from "../vars/vars.js";
import {uiState} from "../states/UIState";

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
        const isBeatPlaying = uiState.currentPlayingBeatIndex === index;

        const handleClick = (e) => {
            const newSoundType = Number(e.target.dataset.sound) + 1;
            const newValue = beat.beatSound.chooseAnotherSound(newSoundType);
            beat.updateSoundSetting("soundType", newValue);
        }

        return (
            <div className="beat-row">
                <div
                    className={`beat ${isBeatPlaying ? 'playing' : ''}`}
                    data-beat={index}
                    data-sound={beat.beatSound.soundIndex}
                    onClick={handleClick}
                ></div>
                <NoteSizeDropdown metronomeManager={metronomeManager} beat={beat} index={index}/>
                <NoteAmountDropdown metronomeManager={metronomeManager} beat={beat} index={index}/>
            </div>
        )
    })
;

const NoteSizeDropdown = observer(({metronomeManager, beat, index}) => {
    const handleChange = (e) => {
        const targetValue = e.target.value;
        beat.noteSettings = NOTES.find(
            noteObject => targetValue === noteObject.note);
        metronomeManager.updateMetronome();
    }

    const currentValue = `${beat.noteSettings.note}`;

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
                    value={`${note.note}`}
                >
                    {note.label}
                </option>
            ))}
        </select>
    )
});

const NoteAmountDropdown = observer(({metronomeManager, beat, index}) => {
    const handleChange = (e) => {
        beat.noteAmount = Number(e.target.value);

        metronomeManager.updateMetronome();
    }

    return (
        <select
            id={`note-amount-dropdown-${index}`}
            className="note-amount-dropdown"
            onChange={handleChange}
            value={beat.noteAmount}
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