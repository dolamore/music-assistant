import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function CheckBoxControls({metronomeManager}) {
    return (
        <div className="checkbox-controls-container">
            <label><input type="checkbox" id="toggle-pendulum" checked/> Show Pendulum Bar</label>
            <label><input type="checkbox" id="toggle-flashing-bar" checked/> Show Flashing Bar</label>
            <label><input type="checkbox" id="toggle-beat-bars" checked/> Show Beat Bars</label>
        </div>
    );
}));