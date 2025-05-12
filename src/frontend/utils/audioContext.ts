import * as Tone from "tone";

let isAudioContextUnlocked = false;

async function setupAudioContextUnlocker(): Promise<void> {
  if (isAudioContextUnlocked) return;

  await Tone.start();
  await Tone.getContext().resume();
  isAudioContextUnlocked = true;
}

// Хук должен возвращать саму функцию, которую можно вызвать
export function useAudioContextUnlocker() {
  return setupAudioContextUnlocker;
}
