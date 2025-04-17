import {makeAutoObservable} from "mobx";
import {SoundManager} from "./SoundManager.js";
import {
    BPM_MAX_LIMIT,
    BPM_MIN_LIMIT,
    DEFAULT_INITIAL_BPM,
} from "../vars/vars.js";
import {BeatBarsManager} from "./BeatBarsManager.js";
import {ElementsManager} from "./ElementsManager.js";
import * as Tone from "tone";
import {TrainingModeManager} from "./TrainingModeManager.js";
import {VisualEffectsManager} from "./VisualEffectsManager.js";
import document from "react";
import {AudioEngine} from "../audio-engine/AudioEngine.js";
import {TonejsSynthSounds} from "../models/Sounds/TonejsSynthSounds.ts";
import {TonejsEngine} from "../audio-engine/engines/TonejsEngine.js";


export class MetronomeManager {

    constructor() {
        this._isPlaying = false;

        this._soundManager = new SoundManager(this);
        this._beatBarsManager = new BeatBarsManager(this);
        this._elementsManager = new ElementsManager(this);
        this.trainingModeManager = new TrainingModeManager();
        this.visualEffectsManager = new VisualEffectsManager();
        this._audioEngine = new TonejsEngine(this);

        makeAutoObservable(this)

    }

    get audioEngine() {
        return this._audioEngine;
    }

    get isPlaying() {
        return this._isPlaying;
    }

    set isPlaying(value) {
        this._isPlaying = value;
    }

    get beatBarsManager() {
        return this._beatBarsManager;
    }

    get elementsManager() {
        return this._elementsManager;
    }

    get soundManager() {
        return this._soundManager;
    }

    tempStart() {
        this._isPlaying = true;
        this._audioEngine.startPlaying();

        //TODO: move pendulum!
        //    this.elementsManager.movePendulum();
    }


     stopMetronome() {
         this.isPlaying = false;
         this._audioEngine.stopPlaying();

    //     this.elementsManager.resetPendulumAnimation();
    // }

    // restartMetronomeAndPendulum() {
    //     this.stopMetronome();
    //     this.startMetronome();
    // }

    // restartIfPlaying() {
    //     if (this.isPlaying) {
    //         this.restartMetronomeAndPendulum();
    //     }
     }

     updateMetronome() {
            this._audioEngine.updateBeatSequence();
            this._elementsManager.updateTimeSignature();
     }
}