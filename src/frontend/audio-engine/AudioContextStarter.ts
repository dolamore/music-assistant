import * as Tone from "tone";

export function resumeAudioContextOnUserGesture(): Promise<void> {
    return new Promise((resolve) => {
        const startAudio = async () => {
            await Tone.start();
            console.log("Audio context resumed!");
            document.removeEventListener("click", startAudio);
            document.removeEventListener("keydown", startAudio);
            resolve();
        };

        document.addEventListener("click", startAudio);
        document.addEventListener("keydown", startAudio);
    });
}