import React, {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";
import {uiState} from "../states/UIState.js";

export default inject("metronomeManager")(observer(function Pendulum({metronomeManager}) {
    const pendulumBarRef = useRef(null);
    const pendulumRef = useRef(null);

    useEffect(() => {
        if (!metronomeManager.isPlaying) {
            if (pendulumRef.current) {
                pendulumRef.current.style.transform = 'translateX(0px)';
            }
            return;
        }

        // Получаем размеры для расчета максимального смещения
        const barWidth = pendulumBarRef.current?.clientWidth || 0;
        const pendulumWidth = pendulumRef.current?.clientWidth || 0;
        const maxPosition = (barWidth - pendulumWidth); // Половина доступного пространства

        // Обновляем CSS-переменную для маятника
        if (pendulumRef.current) {
// Используем значение из uiState для позиции (-100 до 100)
            // и масштабируем его до реальных пикселей
            const position = (uiState.pendulumPosition / 100) * maxPosition;
            pendulumRef.current.style.transform = `translateX(${position}px)`;
        }
    }, [metronomeManager.isPlaying, uiState.pendulumPosition]);

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