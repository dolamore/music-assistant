import {makeAutoObservable} from "mobx";
import {BeatBarsManager} from "./BeatBarsManager";
import {ElementsManager} from "./ElementsManager";
import {TrainingModeManager} from "./TrainingModeManager";
import {VisualEffectsManager} from "./VisualEffectsManager";
import {TonejsEngine} from "../audio-engine/engines/TonejsEngine";
import {AudioEngine} from "../audio-engine/AudioEngine";


export class MetronomeManager {

    private readonly _beatBarsManager: BeatBarsManager;
    private readonly _elementsManager: ElementsManager;
    private readonly _trainingModeManager: TrainingModeManager;
    private readonly _visualEffectsManager: VisualEffectsManager;
    private readonly _audioEngine: AudioEngine;
    private _isPlaying: boolean;

    constructor() {
        this._isPlaying = false;

        this._beatBarsManager = new BeatBarsManager(this);
        this._elementsManager = new ElementsManager();
        this._trainingModeManager = new TrainingModeManager(this);
        this._visualEffectsManager = new VisualEffectsManager();
        this._audioEngine = new TonejsEngine(this);

        makeAutoObservable(this)
    }

    get audioEngine() {
        return this._audioEngine;
    }

    get isPlaying() {
        return this._isPlaying;
    }

    get beatBarsManager() {
        return this._beatBarsManager;
    }

    get elementsManager() {
        return this._elementsManager;
    }

    get trainingModeManager(): TrainingModeManager {
        return this._trainingModeManager;
    }

    get visualEffectsManager(): VisualEffectsManager {
        return this._visualEffectsManager;
    }

    startMetronome() {
        this._isPlaying = true;
        this._audioEngine.startPlaying();
    }


    stopMetronome() {
        this._isPlaying = false;
        this._audioEngine.stopPlaying();
    }

    updateMetronome() {
        this._audioEngine.updateBeatSequence();
        this._beatBarsManager.updateTimeSignature();
    }
}