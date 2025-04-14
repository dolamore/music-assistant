export abstract class AudioEngine {
    abstract unblockAudioContext(): Promise<void>;
}
