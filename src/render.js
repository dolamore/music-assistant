import {MetronomeManager} from "./metronomeManager.js";
import {HotBindManager} from "./hotBindManager.js";
import {ButtonsManager} from "./buttonsManager.js";


const hotBindManager = new HotBindManager();
const metronomeManager = new MetronomeManager();
const buttonsManager = new ButtonsManager(metronomeManager);

document.addEventListener('DOMContentLoaded', function () {
    metronomeManager.renderMetronomeElements();

    hotBindManager.renderHotBinds();

    buttonsManager.renderButtons();
});

