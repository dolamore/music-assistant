import React, { useState, useEffect, useCallback } from "react";
import { useAudioContextUnlocker } from "../utils/audioContext";

export const AudioContextProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                children,
                                                                              }) => {
  const unlockAudioContext = useAudioContextUnlocker();
  const [isAudioContextUnlocked, setIsAudioContextUnlocked] = useState(false);

  const handleUserInteraction = useCallback(async () => {
    await unlockAudioContext();
    setIsAudioContextUnlocked(true);

    const userInteractionEvents = [
      "click",
      "touchstart",
      "keydown",
      "mousedown",
      "pointerdown",
    ];

    userInteractionEvents.forEach((eventName) => {
      window.removeEventListener(eventName, handleUserInteraction);
    });
  }, [unlockAudioContext]);

  useEffect(() => {
    if (isAudioContextUnlocked) return;

    const userInteractionEvents = [
      "click",
      "touchstart",
      "keydown",
      "mousedown",
      "pointerdown",
    ];

    userInteractionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleUserInteraction);
    });

    return () => {
      userInteractionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserInteraction);
      });
    };
  }, [isAudioContextUnlocked, handleUserInteraction]);

  return <>{children}</>;
};