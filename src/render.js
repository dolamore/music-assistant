import * as Tone from 'https://cdn.skypack.dev/tone';

const synth = new Tone.Synth().toDestination();

let bpm = 120;
let isPlaying = false;
let loop;


// Обновляем BPM из input
document.getElementById('bpm').addEventListener('input', (e) => {
    bpm = parseInt(e.target.value, 10) || 120;
    if (loop) loop.stop();
    if (isPlaying) startMetronome();
});

// Старт/стоп метронома
document.getElementById('start-stop').addEventListener('click', async () => {
    await Tone.start();
    if (isPlaying) {
        stopMetronome();
    } else {
        startMetronome();
    }
});

// Запуск метронома
function startMetronome() {
    isPlaying = true;
    Tone.getTransport().bpm.value = bpm;

    loop = new Tone.Loop((time) => {
        synth.triggerAttackRelease("C4", "8n", time);
    }, "4n").start(0);  // Каждая четверть нота

    Tone.getTransport().start();
    document.getElementById('start-stop').textContent = 'Stop';
}

// Остановка метронома
function stopMetronome() {
    isPlaying = false;
    if (loop) loop.stop();
    Tone.getTransport().stop();
    document.getElementById('start-stop').textContent = 'Start';
}
