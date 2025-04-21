import React, {useEffect, useRef} from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {NOTE_MULTIPLIERS} from "../vars/vars.js";

export default inject("metronomeManager")(observer(function Pendulum({metronomeManager}) {
    const pendulumBarRef = useRef(null);
    const pendulumRef = useRef(null);

    // Эффект для обработки анимации маятника
    useEffect(() => {
        if (!metronomeManager.isPlaying) {
            // Сбрасываем позицию маятника
            if (pendulumRef.current) {
                pendulumRef.current.style.left = '0px';
            }
            return;
        }

        // Запуск анимации маятника
        let animationFrame;
        const barWidth = pendulumBarRef.current?.clientWidth || 0;
        const pendulumWidth = pendulumRef.current?.clientWidth || 0;
        const maxPosition = barWidth - pendulumWidth;
        const beatDuration = (60 / metronomeManager.audioEngine.bpm) * 1000 *
            NOTE_MULTIPLIERS[metronomeManager.elementsManager._currentNoteSizeIndex];
        const pendulumPeriod = beatDuration * 2;

        let startTime = performance.now();

        const updatePendulumPosition = (currentTime) => {
            if (!metronomeManager.isPlaying) return;

            const elapsed = (currentTime - startTime) % pendulumPeriod;
            const normalizedTime = elapsed / pendulumPeriod;

            const position = normalizedTime <= 0.5
                ? normalizedTime * 2 * maxPosition
                : maxPosition - (normalizedTime - 0.5) * 2 * maxPosition;

            if (pendulumRef.current) {
                pendulumRef.current.style.left = `${position}px`;
            }

            animationFrame = requestAnimationFrame(updatePendulumPosition);
        };

        animationFrame = requestAnimationFrame(updatePendulumPosition);

        // Очистка при размонтировании или изменении состояния
        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [metronomeManager.isPlaying, metronomeManager.audioEngine.bpm,
        metronomeManager.elementsManager._currentNoteSizeIndex]);

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
                    className="pendulum"></div>
            </div>
        </div>
    );
}));