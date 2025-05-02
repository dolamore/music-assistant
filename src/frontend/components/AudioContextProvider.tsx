// AudioContextProvider.tsx
import React, { useEffect } from 'react';
import { useAudioContextUnlocker } from '../utils/audioContext';

export const AudioContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const unlockAudioContext = useAudioContextUnlocker();

    useEffect(() => {
        const userInteractionEvents = [
            'click', 'touchstart', 'keydown', 'mousedown', 'pointerdown'
        ];

        const handleUserInteraction = async () => {
            await unlockAudioContext();

            // Удаляем слушатели после первого взаимодействия
            userInteractionEvents.forEach(eventName => {
                window.removeEventListener(eventName, handleUserInteraction);
            });
        };

        userInteractionEvents.forEach(eventName => {
            window.addEventListener(eventName, handleUserInteraction);
        });

        return () => {
            userInteractionEvents.forEach(eventName => {
                window.removeEventListener(eventName, handleUserInteraction);
            });
        };
    }, [unlockAudioContext]);

    return <>{children}</>;
};