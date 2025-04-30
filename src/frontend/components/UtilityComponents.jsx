import React, {useEffect, useState} from "react";
import { observer } from "mobx-react-lite";
import {preventNonDigitInput} from "../utils/utils.js";

export const ControlsContainer = observer(({id, changeFunc, variable, minLimit, maxLimit, defaultValue, label}) => {
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

export const ChangingButton = observer(({ id, onClick, disabled, label }) => (
    <button
        id={id}
        onClick={onClick}
        disabled={disabled}
        className={disabled ? 'button-limit' : ''}
    >
        {label}
    </button>
));

export const InputField = observer(({id, inputVar, changeHandler, defaultValue, minLimit, maxLimit}) => {
    const [inputValue, setInputValue] = useState(inputVar);

    useEffect(() => {
        setInputValue(inputVar);
    }, [inputVar]);

    const handleChange = (e) => {
        let value = e.target.value;
        // Remove leading zeros
        if (/^0\d+$/.test(value)) {
            value = value.replace(/^0+/, '');
        }
        // Limit the value to the allowable BPM range
        const intValue = parseInt(value, 10);
        if (intValue > maxLimit) {
            value = maxLimit;
        } else if (intValue < minLimit) {
            value = minLimit;
        }
        setInputValue(value);
    };

    const handleBlur = () => {
        const newValue = inputValue === '' ? defaultValue : Number(inputValue);
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

export const ToggleCheckbox = observer(({id, checked, onChange, label}) => {
    return (
        <label>
            <input type="checkbox" id={id} checked={checked} onChange={onChange}/>
            {label}
        </label>
    );
});