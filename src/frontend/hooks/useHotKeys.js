import { useEffect } from "react";

export const  useHotkeys = (keyBindings) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const { key, shiftKey, altKey, ctrlKey, metaKey } = event;

            const modifierKey = [
                shiftKey && "Shift",
                altKey && "Alt",
                ctrlKey && "Ctrl",
                metaKey && "Meta",
                key
            ].filter(Boolean).join("+")

            if (keyBindings[modifierKey]) {
                event.preventDefault();
                keyBindings[modifierKey]();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [keyBindings]);
};
