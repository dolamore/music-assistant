export interface AudioEngine {
    start(): Promise<void>; // Начало работы аудио-движка
    stop(): void; // Остановка аудио-движка
    playNote(note: string, duration: string, time: number): void; // Воспроизведение ноты
    setBpm(bpm: number): void; // Установка BPM
    generateSequence(): any[]; // Генерация последовательности (метронома)
    updateSequence(): void; // Обновление последовательности
    handleBpmChange(newBpm: number): void; // Обработка изменения BPM
}