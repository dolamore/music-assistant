/* eslint-disable */
// Mock для библиотеки Tone.js

// Определение типов для ToneOscillatorType
export enum ToneOscillatorType {
  sine = 'sine',
  square = 'square',
  triangle = 'triangle',
  sawtooth = 'sawtooth'
}

class ToneLoop {
  callback: (time: number) => void;
  interval: string;

  constructor(callback: (time: number) => void, interval: string) {
    this.callback = callback;
    this.interval = interval;
  }

  start = jest.fn();
  stop = jest.fn();
  dispose = jest.fn();
}


// Создание основного объекта Tone
const Tone = {
  getContext: jest.fn().mockReturnValue({
    resume: jest.fn().mockReturnValue(Promise.resolve()),
    state: 'running',
  }),
  setContext: jest.fn(),
  Synth: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    triggerAttackRelease: jest.fn(),
    triggerAttack: jest.fn(),
    triggerRelease: jest.fn(),
    dispose: jest.fn(),
    volume: { value: 0 },
    detune: { value: 0 },
    oscillator: {
      type: 'sine',
      frequency: { value: 440 },
      phase: 0
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.8
    }
  })),
  FMSynth: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    triggerAttackRelease: jest.fn(),
    triggerAttack: jest.fn(),
    triggerRelease: jest.fn(),
    dispose: jest.fn(),
    volume: { value: 0 },
    oscillator: {
      type: 'sine',
      frequency: { value: 440 },
      phase: 0
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.8
    }
  })),
  AMSynth: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    triggerAttackRelease: jest.fn(),
    triggerAttack: jest.fn(),
    triggerRelease: jest.fn(),
    dispose: jest.fn(),
    volume: { value: 0 },
    oscillator: {
      type: 'sine',
      frequency: { value: 440 },
      phase: 0
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.8
    }
  })),
  PolySynth: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    triggerAttackRelease: jest.fn(),
    triggerAttack: jest.fn(),
    triggerRelease: jest.fn(),
    dispose: jest.fn(),
    volume: { value: 0 },
    oscillator: {
      type: 'sine',
      frequency: { value: 440 },
      phase: 0
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.5,
      release: 0.8
    }
  })),
  PingPongDelay: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    connect: jest.fn(),
    dispose: jest.fn(),
  })),
  context: {
    resume: jest.fn().mockReturnValue(Promise.resolve()),
    state: 'running',
  },
  Transport: {
    start: jest.fn(),
    stop: jest.fn(),
    bpm: { value: 120 },
    scheduleRepeat: jest.fn().mockReturnValue(0),
    schedule: jest.fn().mockReturnValue(0),
    cancel: jest.fn(),
    clear: jest.fn(),
  },
  getTransport: jest.fn().mockReturnValue({
    start: jest.fn(),
    stop: jest.fn(),
    bpm: { value: 120 },
    scheduleRepeat: jest.fn().mockReturnValue(0),
    schedule: jest.fn().mockReturnValue(0),
    cancel: jest.fn(),
    clear: jest.fn(),
  }),
  Loop: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    dispose: jest.fn(),
  })),
  Player: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    start: jest.fn(),
    stop: jest.fn(),
    connect: jest.fn(),
    dispose: jest.fn(),
    volume: { value: 0 },
    loaded: true,
    autostart: false,
    loop: false,
    mute: false,
  })),
  Distortion: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    connect: jest.fn(),
    dispose: jest.fn(),
  })),
  Reverb: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    connect: jest.fn(),
    dispose: jest.fn(),
  })),
  Channel: jest.fn().mockImplementation(() => ({
    receive: jest.fn().mockReturnThis(),
    toDestination: jest.fn().mockReturnThis(),
    connect: jest.fn(),
    dispose: jest.fn(),
  })),
  Now: jest.fn().mockReturnValue(0),
  Destination: {
    mute: false,
    volume: { value: 0 },
  },
  start: jest.fn().mockReturnValue(Promise.resolve()),
  Master: {
    mute: false,
    volume: { value: 0 },
  },
};

// Экспорт по умолчанию и именованные экспорты
export default Tone;
export const getContext = Tone.getContext;
export const setContext = Tone.setContext;