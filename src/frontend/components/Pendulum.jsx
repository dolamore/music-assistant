import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function Pendulum({metronomeManager}) {
    return (
        <div
            id="pendulum-container"
            className={`pendulum-container
                        container
                        ${!metronomeManager.visualEffectsManager.isPendulumVisible ? 'hidden' : ''}`}
        >
            <div
                id="pendulum-horizontal-bar"
                className="horizontal-bar">
                <div
                    id="pendulum"
                    className="pendulum"></div>
            </div>
        </div>
    );
}));