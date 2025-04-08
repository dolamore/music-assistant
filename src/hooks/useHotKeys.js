import { useEffect } from "react";

export function useHotkeys(hotkeyMap) {
    useEffect(() => {
        const handler = (event) => {
            const keys = [];

            if (event.ctrlKey) keys.push("Ctrl");
            if (event.shiftKey) keys.push("Shift");
            if (event.altKey) keys.push("Alt");

            const key = event.key === " " ? "Space" : event.key;
            keys.push(key);

            const combo = keys.join("+");

            if (hotkeyMap[combo]) {
                event.preventDefault(); // чтобы не скроллила страница
                hotkeyMap[combo]();
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [hotkeyMap]);
}
