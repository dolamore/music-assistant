export interface AudioEngineInterface {
    init(): Promise<void>;
    playSound(sound: any, settings?: any): void;
    stop(): void;
}