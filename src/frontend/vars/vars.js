import * as Tone from "tone";
// Default to '4n' (quarter note)
export const NOTE_MULTIPLIERS = [4, 2, 1, 0.5, 0.25, 0.125, 0.0625];

export const INITIAL_NUMBER_OF_BEATS = 4;

export const MAX_BEATS_AMOUNT = 16;
export const MIN_BEATS_AMOUNT = 1;

export const NOTES = [
    {noteSize: 1, label: "1", isTriplet: false, note: "1n"},
    {noteSize: 1, label: "1T", isTriplet: true, note: "1t"},
    {noteSize: 2, label: "1/2", isTriplet: false, note: "2n"},
    {noteSize: 2, label: "1/2T", isTriplet: true, note: "2t"},
    {noteSize: 4, label: "1/4", isTriplet: false, note: "4n"},
    {noteSize: 4, label: "1/4T", isTriplet: true, note: "4t"},
    {noteSize: 8, label: "1/8", isTriplet: false, note: "8n"},
    {noteSize: 8, label: "1/8T", isTriplet: true, note: "8t"},
    {noteSize: 16, label: "1/16", isTriplet: false, note: "16n"},
    {noteSize: 16, label: "1/16T", isTriplet: true, note: "16t"},
    {noteSize: 32, label: "1/32", isTriplet: false, note: "32n"},
    {noteSize: 32, label: "1/32T", isTriplet: true, note: "32t"},
    {noteSize: 64, label: "1/64", isTriplet: false, note: "64n"},
    {noteSize: 64, label: "1/64T", isTriplet: true, note: "64t"}
];

export function getDefaultNote() {
    return NOTES.find(note => note.noteSize === DEFAULT_NOTE_SIZE && note.isTriplet === DEFAULT_IS_TRIPLET);
}

export const NOTE_AMOUNTS = [1, 2, 3, 4];

export function getDefaultNoteAmount() {
    return NOTE_AMOUNTS.find(noteAmount => noteAmount === DEFAULT_NOTE_AMOUNT);
}

export const DEFAULT_INITIAL_BPM = 120;
export const BPM_MAX_LIMIT = 500;
export const BPM_MIN_LIMIT = 1;
export const DEFAULT_NOTE_SIZE = 4;
export const DEFAULT_IS_TRIPLET = false;
export const DEFAULT_NOTE_AMOUNT = 1;
export const DEFAULT_SOUND_INDEX = 1;
//export const defaultNoteSkipProbability = elements.noteSkipProbabilityInput.value / 100
//export const defaultLoopSkipProbability = elements.loopSkipProbabilityInput.value / 100;