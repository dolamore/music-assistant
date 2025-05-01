import metronome from "../components/Metronome";
import {MetronomeManager} from "../managers/MetronomeManager";

export type MetronomeManagerInputType = {
    metronomeManager: MetronomeManager
}

//TODO: проверить number или string переменные
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