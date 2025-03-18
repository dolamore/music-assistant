import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function BeatBars({metronomeManager}) {
    return (
        <div id="beat-container"
             className={`beat-container
                 container
                 ${!metronomeManager.visualEffectsManager.areBeatBarsVisible ? 'hidden' : ''}`}
        >
        </div>
    )
    //Сюда будет динамически добавляться содержимое через renderBeats
}));