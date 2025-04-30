import Note from "../models/Note";

export const NOTE_MULTIPLIERS: number[] = [4, 2, 1, 0.5, 0.25, 0.125, 0.0625];

export const INITIAL_NUMBER_OF_BEATS: number = 4;

export const MAX_BEATS_AMOUNT: number = 16;
export const MIN_BEATS_AMOUNT: number = 1;

export const NOTES: Note[] = [
    new Note(1, false),
    new Note(1, true),
    new Note(2, false),
    new Note(2, true),
    new Note(4, false),
    new Note(4, true),
    new Note(8, false),
    new Note(8, true),
    new Note(16, false),
    new Note(16, true),
    new Note(32, false),
    new Note(32, true),
    new Note(64, false),
    new Note(64, true)
];

export function getDefaultNote(): Note {
    return NOTES.find(note => note.noteSize === DEFAULT_NOTE_SIZE && note.isTriplet === DEFAULT_IS_TRIPLET) || new Note(DEFAULT_NOTE_SIZE, DEFAULT_IS_TRIPLET);
}

export const NOTE_AMOUNTS: number[] = [1, 2, 3, 4];

export const DEFAULT_INITIAL_BPM: number = 120;
export const BPM_MAX_LIMIT: number = 500;
export const BPM_MIN_LIMIT: number = 1;
export const DEFAULT_NOTE_SIZE: number = 4;
export const DEFAULT_IS_TRIPLET: boolean= false;
export const DEFAULT_NOTE_AMOUNT: number = 1;
export const DEFAULT_SOUND_INDEX: number = 1;
export const DEFAULT_NOTE_SKIP_PROBABILITY: number = 20
export const DEFAULT_LOOP_SKIP_PROBABILITY: number = 25;