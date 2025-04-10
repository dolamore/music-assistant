import {AudioEngineInterface} from '../interfaces/audioEngineInterface';
import * as Tone from 'tone';

export class TonejsEngineService implements AudioEngineInterface {
    private transport = Tone.getTransport();
    private loop: Tone.Loop | null = null;
    private sequence: any[] = [];

    async init(): Promise<void> {
        await Tone.start();
        console.log("Tone.js started");
    }

    playSound(sound: any, settings: any): void {
        if (!sound || !sound.triggerAttackRelease) return;

        const duration = settings.duration || "8n";
        const frequency = settings.frequency || "C4";

        sound.triggerAttackRelease(frequency, duration);
    }

    async start(): Promise<void> {
        await Tone.start();
       // await Tone.getContext().rawContext.resume(); возможно, это нужно
    }

    stop(): void {
        if (this.loop) this.loop.stop();
        this.transport.stop();
    }

    playNote(note: string, duration: string, time: number): void {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(note, duration, time);
    }

    setBpm(bpm: number): void {
        this.transport.bpm.value = bpm * 3; // Умножаем на 3, как указано в вашем коде
    }

    generateSequence(): any[] {
        // Реализуйте логику для генерации последовательности
        // Здесь можно использовать ваш метод generateFixedMetronomeSequence
        return [];
    }

    updateSequence(): void {
        // Обновление последовательности (если нужно)
    }

    handleBpmChange(newBpm: any): void {
        if (/^0\d/.test(newBpm)) {
            newBpm = newBpm.replace(/^0+/, '');
        }

        if (isNaN(newBpm) || newBpm === '') {
            return;
        }

        if (newBpm > 300) {
            this.setBpm(300);
        } else if (newBpm < 40) {
            this.setBpm(40);
        } else {
            this.setBpm(newBpm);
        }
    }
}
