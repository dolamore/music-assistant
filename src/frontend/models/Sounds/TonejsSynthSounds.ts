import {Sounds} from "./Sounds";
import {TONEJS_SYNTH_SOUNDS} from "../../vars/sounds/TONEJS_SYNTH_SOUNDS";

export class TonejsSynthSounds extends Sounds {
    constructor() {
        super(TONEJS_SYNTH_SOUNDS);
    }
}