import React from "react";
import {observer} from "mobx-react-lite";
import {inject} from "mobx-react";

export default inject("metronomeManager")(observer(function FlashingBar({metronomeManager}) {
    return (
        <div className="flashing-bar container"></div>
    )
}));