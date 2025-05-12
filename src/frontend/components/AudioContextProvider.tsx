import React, { useState, useEffect } from "react";
import { useAudioContextUnlocker } from "../utils/audioContext";

export const AudioContextProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                children,
                                                                              }) => {
  const unlockAudioContext = useAudioContextUnlocker();
  const [isAudioContextUnlocked, setIsAudioContextUnlocked] = useState(false);

  useEffect(() => {
    if (isAudioContextUnlocked) return;

    const userInteractionEvents = [
      "click",
      "touchstart",
      "keydown",
      "mousedown",
      "pointerdown",
    ];

    const handleUserInteraction = async () => {
      await unlockAudioContext();
      setIsAudioContextUnlocked(true);

      userInteractionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserInteraction);
      });
    };

    userInteractionEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleUserInteraction);
    });

    return () => {
      userInteractionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleUserInteraction);
      });
    };
  }, [isAudioContextUnlocked, unlockAudioContext]);

  return <>{children}</>;
};
