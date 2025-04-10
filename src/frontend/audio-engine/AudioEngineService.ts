import { AudioEngineInterface } from "./interfaces/audioEngineInterface";
import { TonejsEngineService } from "./services/TonejsEngineService";

export class AudioEngineService {
    private engine: AudioEngineInterface;

    constructor() {
        this.engine = new TonejsEngineService();
    }

    async init(): Promise<void> {
        await this.engine.init();
    }

    playSound(sound: any, settings?: any): void {
        this.engine.playSound(sound, settings);
    }

    stop(): void {
        this.engine.stop();
    }
}
