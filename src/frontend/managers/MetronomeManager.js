import {makeAutoObservable} from "mobx";
import {BeatBarsManager} from "./BeatBarsManager.js";
import {ElementsManager} from "./ElementsManager.js";
import {TrainingModeManager} from "./TrainingModeManager.js";
import {VisualEffectsManager} from "./VisualEffectsManager.js";
import {TonejsEngine} from "../audio-engine/engines/TonejsEngine.js";


export class MetronomeManager {

    constructor() {
        this._isPlaying = false;

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

    startMetronome() {
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
    }

    updateMetronome() {
        this._audioEngine.updateBeatSequence();
        this._elementsManager.updateTimeSignature();
    }
}