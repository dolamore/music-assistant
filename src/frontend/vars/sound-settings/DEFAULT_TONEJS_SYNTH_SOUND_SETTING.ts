export const DEFAULT_TONEJS_SYNTH_SOUND_SETTINGS = [
    { key: 'frequency', value: 440, label: "Frequency", minValue: 0, maxValue: 20000 }, // частота от 0 до 20кГц
    { key: 'detune', value: 0, label: "Detune", minValue: -1200, maxValue: 1200 }, // ±1 октава (в центах)
    { key: 'phase', value: 0, label: "Phase", minValue: 0, maxValue: 360 }, // градусы
    { key: 'volume', value: 0, label: "Volume", minValue: -60, maxValue: 0 }, // dB, обычно от -∞ до 0
    { key: 'attack', value: 0.001, label: "Attack", minValue: 0.001, maxValue: 10 }, // секунды
    { key: 'decay', value: 0.1, label: "Decay", minValue: 0.001, maxValue: 10 }, // секунды
    { key: 'sustain', value: 0, label: "Sustain", minValue: 0, maxValue: 1 }, // пропорция
    { key: 'release', value: 0.1, label: "Release", minValue: 0.001, maxValue: 10 }, // секунды
]