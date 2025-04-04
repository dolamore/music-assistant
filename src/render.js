import {MetronomeManager} from "./managers/metronomeManager.js";
import {HotBindManager} from "./managers/hotBindManager.js";
import {ButtonsManager} from "./managers/buttonsManager.js";


const hotBindManager = new HotBindManager();
const metronomeManager = new MetronomeManager();
const buttonsManager = new ButtonsManager(metronomeManager);

document.addEventListener('DOMContentLoaded', function () {
    metronomeManager.renderMetronomeElements();

    hotBindManager.renderHotBinds();

    buttonsManager.renderButtons();
});

