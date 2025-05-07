import React, { ReactElement } from "react";
import { observer } from "mobx-react-lite";
import { DEFAULT_NOTE_SIZE, NOTE_AMOUNTS, NOTES } from "../vars/vars";
import { uiState } from "../states/UIState";
import {
  BeatDropdownInputType,
  BeatRowInputType,
  MetronomeManagerInputType,
} from "../models/ComponentsTypes";
import Note from "../models/Note";
import { DEFAULT_SOUNDS } from "../vars/sounds/DEFAULT_SOUNDS";

export default observer(function BeatBars({
  metronomeManager,
}: MetronomeManagerInputType) {
  const indices = metronomeManager.beatBarsManager.beats.map((_, i) => i);
  return (
    <div
      id="beat-container"
      className={`beat-container
                         container
                         ${!metronomeManager.visualEffectsManager.areBeatBarsVisible ? "hidden" : ""}`}
    >
      {indices.map((index) => (
        <BeatRow
          key={`beat-row-${index}`}
          metronomeManager={metronomeManager}
          index={index}
          uiState={uiState}
        />
      ))}
    </div>
  );
});

const BeatRow = observer(
  ({ metronomeManager, index, uiState }: BeatRowInputType) => {
    const beat = metronomeManager.beatBarsManager.beats[index];
    const isBeatPlaying = uiState.currentPlayingBeatIndex === index;

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      const newSoundType = Number(e.currentTarget.dataset.sound) + 1;
      const newValue = beat.beatSound.chooseAnotherSound(newSoundType);
      beat.updateSoundSetting("soundType", newValue);
    };

    return (
      <div className="beat-row">
        <div
          className={`beat ${isBeatPlaying ? "playing" : ""}`}
          data-beat={index}
          data-sound={DEFAULT_SOUNDS.findIndex(
            (sound) => sound.key === beat.beatSound.key,
          )}
          onClick={handleClick}
        ></div>
        <NoteSizeDropdown
          metronomeManager={metronomeManager}
          beat={beat}
          index={index}
        />
        <NoteAmountDropdown
          metronomeManager={metronomeManager}
          beat={beat}
          index={index}
        />
      </div>
    );
  },
);

const NoteSizeDropdown = observer(
  ({ metronomeManager, beat, index }: BeatDropdownInputType): ReactElement => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const targetValue = e.target.value;
      beat.noteSettings =
        NOTES.find((noteObject) => targetValue === noteObject.note) ||
        new Note(DEFAULT_NOTE_SIZE, true);
      metronomeManager.updateMetronome();
    };

    const currentValue = `${beat.noteSettings.note}`;

    return (
      <select
        id={`note-size-dropdown-${index}`}
        className="note-size-dropdown"
        onChange={handleChange}
        value={currentValue}
      >
        {NOTES.map((note, noteIndex) => (
          <option key={`note-${noteIndex}`} value={`${note.note}`}>
            {note.label}
          </option>
        ))}
      </select>
    );
  },
);

const NoteAmountDropdown = observer(
  ({ metronomeManager, beat, index }: BeatDropdownInputType): ReactElement => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      beat.noteAmount = Number(e.target.value);

      metronomeManager.updateMetronome();
    };

    return (
      <select
        id={`note-amount-dropdown-${index}`}
        className="note-amount-dropdown"
        onChange={handleChange}
        value={beat.noteAmount}
      >
        {NOTE_AMOUNTS.map((amount, amountIndex) => (
          <option key={`amount-${amountIndex}`} value={amount}>
            {amount}
          </option>
        ))}
      </select>
    );
  },
);
