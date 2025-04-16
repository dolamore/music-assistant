import {Time} from "tone/build/esm/core/type/Units";

export abstract class Instrument {
    abstract play(time: number): void;
}

export type InstrumentType = {
    play: (time: number) => void;
};