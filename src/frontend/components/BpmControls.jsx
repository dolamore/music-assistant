import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import {BPM_MAX_LIMIT, BPM_MIN_LIMIT, DEFAULT_INITIAL_BPM} from "../vars/vars";
import {inject} from "mobx-react";
import {ChangingButton, InputField} from "./UtilityComponents";

export default inject("metronomeManager")(observer(function BpmControls({metronomeManager}) {
    const { bpm, handleBpmChange } = metronomeManager.audioEngine;
    const changeBpm = (change) => {
        handleBpmChange(bpm + change);
    };

    return (
        <div className="bpm-controls-container container">
            <label htmlFor="bpm-input">BPM:</label>
            <div className="bpm-controls">
                <ChangingButton
                    id="bpm-decrease-5"
                    label="-5"
                    onClick={() => changeBpm(-5)}
                    disabled={bpm <= BPM_MIN_LIMIT}
                />
                <ChangingButton
                    id="bpm-decrease-1"
                    label="-1"
                    onClick={() => changeBpm(-1)}
                    disabled={bpm <= BPM_MIN_LIMIT}
                />
                <InputField
                    id="bpm-input"
                    inputVar={bpm}
                    changeHandler={handleBpmChange}
                    defaultValue={DEFAULT_INITIAL_BPM}
                    minLimit={BPM_MIN_LIMIT}
                    maxLimit={BPM_MAX_LIMIT}
                    />
                <ChangingButton
                    id="bpm-increase-1"
                    label="+1"
                    onClick={() => changeBpm(1)}
                    disabled={bpm >= BPM_MAX_LIMIT}
                />
                <ChangingButton
                    id="bpm-increase-5"
                    label="+5"
                    onClick={() => changeBpm(5)}
                    disabled={bpm >= BPM_MAX_LIMIT}
                />
            </div>
        </div>
    );
}));
