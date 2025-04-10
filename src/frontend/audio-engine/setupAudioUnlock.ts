import * as Tone from "tone";

let unlocked = false;

export function setupAudioUnlock() {
    if (unlocked) return;
    unlocked = true;

    const context = Tone.getContext().rawContext;

    const tryUnlock = async () => {
        if (context.state === "running") return;

        try {
            const buffer = context.createBuffer(1, 1, 22050);
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);

            await context.resume();
            console.log("AudioContext unlocked");
        } catch (error) {
            console.error("Failed to unlock AudioContext:", error);
        }
    };

    window.addEventListener("click", tryUnlock, { once: true });
    window.addEventListener("touchstart", tryUnlock, { once: true });
}