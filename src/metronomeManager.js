import {SoundManager} from "./soundManager.js";
import {defaultInitialBPM} from "./vars.js";
import {BeatBarsManager} from "./beatBarsManager.js";

export class MetronomeManager {
    constructor() {
        this.bpm = defaultInitialBPM;
        this.isPlaying = false;
        let loop;
        let count = 0;
        let loopCount = 0;
        let currentNoteSizeIndex = 2;
        let sequence;
        let skipper = 0;
        let currentStep = 0;
        let isStartOfLoop = false;
        this.soundManager = new SoundManager();
        this.beatBarsManager = new BeatBarsManager();
    }

    renderMetronomeElements() {
        this.soundManager.renderSoundElements();
        this.beatBarsManager.renderBeatBars();
    }
}