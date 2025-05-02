import React, {ReactElement, useEffect, useRef} from "react";
import {observer} from "mobx-react-lite";
import {MetronomeManagerInputType} from "../models/ComponentsTypes";

export default (observer(function Pendulum({metronomeManager}: MetronomeManagerInputType): ReactElement {
    //TODO: проверить их типы
    const pendulumBarRef: any = useRef(null);
    const pendulumRef: any = useRef(null);

    useEffect(() => {
        let animationFrameId: number;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) {
                startTime = timestamp;
            }

            // get sizes for max offset
            const barWidth = pendulumBarRef.current?.clientWidth || 0;
            const pendulumWidth = pendulumRef.current?.clientWidth || 0;
            const maxPosition = (barWidth - pendulumWidth);

            // calculate beat duration
            const beatDuration = 60 / metronomeManager.audioEngine.bpm; // Длительность одного удара в секундах

            // elapsed time starting from the beginning in seconds
            const elapsedTime = (timestamp - startTime) / 1000;

            // calculate current pendulum phase (0 to 1)
            const cycleDuration = beatDuration * 2; // Полный цикл (туда-обратно)
            const phase = (elapsedTime % cycleDuration) / cycleDuration;

            // phase to position in %
            let currentPosition;
            if (phase < 0.5) {
                // move to the right (0 -> 100)
                currentPosition = phase * 2 * 100;
            } else {
                // move to the left (100 -> 0)
                currentPosition = (1 - (phase - 0.5) * 2) * 100;
            }

            // apply position
            if (pendulumRef.current) {
                const pixelPosition = (currentPosition / 100) * maxPosition;
                pendulumRef.current.style.transform = `translateX(${pixelPosition}px)`;
            }

            // keep animating
            animationFrameId = requestAnimationFrame(animate);
        };

        if (metronomeManager.isPlaying) {
            startTime = null; // reset time after every start
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