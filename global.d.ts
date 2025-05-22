import { MetronomeManager } from './src/managers/MetronomeManager';

declare global {
    interface Window {
        __METRONOME_MANAGER__: MetronomeManager;
    }
}

export {};