import {MetronomeManager} from "../managers/MetronomeManager";
import TimeSignature from "./TimeSignature";
import Beat from "./Beat";
import {UIState} from "../states/UIState";

export type MetronomeManagerInputType = {
    metronomeManager?: MetronomeManager
}

export type TimeSignatureInfoInputType = {
    timeSignature: TimeSignature
}

export type SoundRowInputType = {
    metronomeManager: MetronomeManager,
    index: number
}

export type BeatDropdownInputType = {
    metronomeManager: MetronomeManager,
    beat: Beat,
    index: number
}

export type BeatRowInputType = {
    metronomeManager: MetronomeManager,
    index: number,
    uiState: UIState
}

export type ControlsContainerInputType = {
    id: string,
    changeFunc: (newValue: number) => void
    variable: number,
    minLimit: number,
    maxLimit: number,
    defaultValue: number
    label: string
}

export type ChangingButtonInputType = {
    id: string,
    onClick: () => void,
    disabled: boolean,
    label: string
}

export type InputFieldInputType = {
    id: string,
    inputVar: number,
    changeHandler: (newValue: number) => void,
    defaultValue: number,
    minLimit: number,
    maxLimit: number
}

export type ToggleCheckboxInputType = {
    id: string,
    checked: boolean,
    onChange: () => void,
    label: string
}