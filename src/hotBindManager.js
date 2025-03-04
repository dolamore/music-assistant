import {buttons} from "./vars.js";

export class HotBindManager {
    renderHotBinds() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                event.preventDefault(); // Предотвращаем скролл страницы
                buttons.startStopButton.click();
            }
        });
    }
}