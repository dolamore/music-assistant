import {MetronomeManager} from "./managers/metronomeManager.js";
import {HotBindManager} from "./managers/hotBindManager.js";


const hotBindManager = new HotBindManager();
const metronomeManager = new MetronomeManager();

document.addEventListener('DOMContentLoaded', function () {
    metronomeManager.renderMetronomeElements();

    hotBindManager.renderHotBinds();
});

