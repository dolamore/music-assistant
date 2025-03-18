import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function VisualCheckBoxControls({metronomeManager}) {
    return (
        <div className="checkbox-controls-container container">
            <label><input type="checkbox" id="toggle-pendulum-bar" checked/> Show Pendulum Bar</label>
            <label><input type="checkbox" id="toggle-flashing-bar" checked/> Show Flashing Bar</label>
            <label><input type="checkbox" id="toggle-beat-bars" checked/> Show Beat Bars</label>
        </div>
    );
}));


//TODO: добавить сперва элемент маятника, а затем функционал его чекбокса
const TogglePendulumCheckbox = observer(({metronomeManager}) => {
    return (
        <label><input type="checkbox" id="toggle-pendulum-bar" checked={metronomeManager.showPendulum}/> Show Pendulum Bar</label>
    );
});