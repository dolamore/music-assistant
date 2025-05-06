import * as Tone from "tone";

let isAudioContextUnlocked = false;

async function setupAudioContextUnlocker(): Promise<void> {
  if (isAudioContextUnlocked) return;

  await Tone.start();
  await Tone.getContext().resume();
  isAudioContextUnlocked = true;
}

export function useAudioContextUnlocker() {
  return async () => {
    await setupAudioContextUnlocker();
  };
}
