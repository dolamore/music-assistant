import {Time} from "tone/build/esm/core/type/Units";

export abstract class Sound {
    abstract play(time: Time): void;
}

export type SoundType = {
    play: (time: Time) => void;
};