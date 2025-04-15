import {Time} from "tone/build/esm/core/type/Units";

export abstract class Instrument {
    abstract play(time: Time): void;
}

export type InstrumentType = {
    play: (time: Time) => void;
};