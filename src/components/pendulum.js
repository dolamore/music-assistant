import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function Pendulum({metronomeManager}) {
    return (
        <div
            className={`pendulum-container
                        container
                        ${!metronomeManager.visualEffectsManager.isPendulumVisible ? 'hidden' : ''}`}
        >
            <div className="horizontal-bar">
                <div className="pendulum"></div>
            </div>
        </div>
    );
}));