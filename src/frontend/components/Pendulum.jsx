import React, {useEffect, useRef} from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function Pendulum({metronomeManager}) {
    const pendulumBarRef = useRef(null);
    const pendulumRef = useRef(null);

    useEffect(() => {
        let animationFrameId;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) {
                startTime = timestamp;
            }

            // Получаем размеры для расчета максимального смещения
            const barWidth = pendulumBarRef.current?.clientWidth || 0;
            const pendulumWidth = pendulumRef.current?.clientWidth || 0;
            const maxPosition = (barWidth - pendulumWidth);

            // Расчет времени на основе BPM
            const beatDuration = 60 / metronomeManager.audioEngine.bpm; // Длительность одного удара в секундах

            // Прошедшее время с момента запуска в секундах
            const elapsedTime = (timestamp - startTime) / 1000;

            // Расчет фазы маятника (от 0 до 1) в текущий момент времени
            const cycleDuration = beatDuration * 2; // Полный цикл (туда-обратно)
            const phase = (elapsedTime % cycleDuration) / cycleDuration;

            // Преобразуем фазу в позицию (0 - 100%)
            let currentPosition;
            if (phase < 0.5) {
                // Движение вправо (0 -> 100%)
                currentPosition = phase * 2 * 100;
            } else {
                // Движение влево (100% -> 0)
                currentPosition = (1 - (phase - 0.5) * 2) * 100;
            }

            // Применяем позицию
            if (pendulumRef.current) {
                const pixelPosition = (currentPosition / 100) * maxPosition;
                pendulumRef.current.style.transform = `translateX(${pixelPosition}px)`;
            }

            // Продолжаем анимацию
            animationFrameId = requestAnimationFrame(animate);
        };

        if (metronomeManager.isPlaying) {
            startTime = null; // Сброс времени при каждом запуске
            animationFrameId = requestAnimationFrame(animate);
        } else if (pendulumRef.current) {
            pendulumRef.current.style.transform = 'translateX(0px)';
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [metronomeManager.isPlaying, metronomeManager.audioEngine.bpm]);

    return (
        <div
            id="pendulum-container"
            className={`pendulum-container
                        container
                        ${!metronomeManager.visualEffectsManager.isPendulumVisible ? 'hidden' : ''}`}
        >
            <div
                ref={pendulumBarRef}
                id="pendulum-horizontal-bar"
                className="horizontal-bar">
                <div
                    ref={pendulumRef}
                    id="pendulum"
                    className="pendulum"
                >
                </div>
            </div>
        </div>
    );
}));