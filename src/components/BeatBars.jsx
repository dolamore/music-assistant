import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

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
        const value = e.target.value;
        metronomeManager.beatBarsManager.noteAttributes.noteSizes[index] = parseInt(value, 10);
        if (value.endsWith('T')) {
            metronomeManager.beatBarsManager.noteAttributes.isTriplets[index] = true;
        }
    }

    return (
        <select
            className="note-size-dropdown"
            data-beat={index}
            onChange={handleChange}
        >
            <option value="1">1</option>
            <option value="1T">1T</option>
            <option value="2">1/2</option>
            <option value="2T">1/2T</option>
            <option value="4" selected>1/4</option>
            <option value="4T">1/4T</option>
            <option value="8">1/8</option>
            <option value="8T">1/8T</option>
            <option value="16">1/16</option>
            <option value="16T">1/16T</option>
            <option value="32">1/32</option>
            <option value="32T">1/32T</option>
            <option value="64">1/64</option>
            <option value="64T">1/64T</option>
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