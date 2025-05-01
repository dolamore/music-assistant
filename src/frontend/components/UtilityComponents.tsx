import React, {ReactElement, useEffect, useState} from "react";
import { observer } from "mobx-react-lite";
import {preventNonDigitInput} from "../utils/utils";
import {
    ChangingButtonInputType,
    ControlsContainerInputType,
    InputFieldInputType, ToggleCheckboxInputType
} from "../models/ComponentsTypes";

export const ControlsContainer = observer(({id, changeFunc, variable, minLimit, maxLimit, defaultValue, label}: ControlsContainerInputType): ReactElement => {
    return (
        <div className={`${id}-controls-container controls-container container`}>
            <label htmlFor={`${id}-input`}>{label}</label>
            <div
                id={`${id}-controls`}
                className={`${id}-controls container`}>
                <ChangingButton
                    id={`${id}-decrease-5`}
                    label="-5"
                    onClick={() => changeFunc(variable-5)}
                    disabled={variable <= minLimit}
                />
                <ChangingButton
                    id={`${id}-decrease-1`}
                    label="-1"
                    onClick={() => changeFunc(variable-1)}
                    disabled={variable <= minLimit}
                />
                <InputField
                    id={`${id}-input`}
                    inputVar={variable}
                    changeHandler={changeFunc}
                    defaultValue={defaultValue}
                    minLimit={minLimit}
                    maxLimit={maxLimit}
                />
                <ChangingButton
                    id={`${id}-increase-1`}
                    label="+1"
                    onClick={() => changeFunc(variable + 1)}
                    disabled={variable >= maxLimit}
                />
                <ChangingButton
                    id={`${id}-increase-5`}
                    label="+5"
                    onClick={() => changeFunc(variable + 5)}
                    disabled={variable >= maxLimit}
                />
            </div>
        </div>
    )
});

export const ChangingButton = observer(({ id, onClick, disabled, label }: ChangingButtonInputType): ReactElement => (
    <button
        id={id}
        onClick={onClick}
        disabled={disabled}
        className={disabled ? 'button-limit' : ''}
    >
        {label}
    </button>
));

export const InputField = observer(({id, inputVar, changeHandler, defaultValue, minLimit, maxLimit}: InputFieldInputType): ReactElement => {
    //TODO: проверить почему перестало срабатывать и добавлять 0
    const [inputValue, setInputValue] = useState(inputVar);

    useEffect(() => {
        setInputValue(inputVar);
    }, [inputVar]);

    //TODO: проверить тип e
    const handleChange = (e: any) => {
        console.log(e.target.value);
        let value: string = e.target.value;
        // Remove leading zeros
        if (/^0\d+$/.test(value)) {
            value = value.replace(/^0+/, '');
        }

        // Limit the value to the allowable BPM range
        let intValue: number = parseInt(value, 10);
        if (intValue > maxLimit) {
            intValue = maxLimit;
        } else if (intValue < minLimit) {
            intValue = minLimit;
        }

        setInputValue(intValue);
    };

    //TODO: проверить нужен ли здесь действительно String
    const handleBlur: () => void = (): void => {
        const newValue = String(inputValue) === '' ? defaultValue : Number(inputValue);
        changeHandler(newValue);
        setInputValue(newValue);
    };

    return (
        <input
            type="number"
            id={id}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => preventNonDigitInput(e)}
        />
    );
});

export const ToggleCheckbox = observer(({id, checked, onChange, label}: ToggleCheckboxInputType): ReactElement => {
    return (
        <label>
            <input type="checkbox" id={id} checked={checked} onChange={onChange}/>
            {label}
        </label>
    );
});