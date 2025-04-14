import * as Tone from 'tone';
import {AudioEngine} from "../AudioEngine";
import {SOUNDS} from "../../vars/Sounds";

export class TonejsEngine extends AudioEngine {
    private transport = Tone.getTransport();
    private loop: Tone.Loop | null = null;
    private sequence: any[] = [];
    
    setupAudioContextUnlocker(): void {
    const unlockAudioContext = async () => {
        await Tone.start();
        await Tone.getContext().resume();
        console.log("Audio context unlocked");

        // Удаляем обработчик после первого вызова
        window.removeEventListener("click", unlockAudioContext);
        window.removeEventListener("keydown", unlockAudioContext);
    };

    // Добавляем обработчики на пользовательские взаимодействия
    window.addEventListener("click", unlockAudioContext);
    window.addEventListener("keydown", unlockAudioContext);
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

    initializeSounds() {
        SOUNDS.forEach(soundObj => {
            if (soundObj.key !== 'no-sound' && !soundObj.sound) {
                soundObj.sound = new Tone.Synth({ oscillator: { type: soundObj.key } }).toDestination();
            }
        });
    }
}
