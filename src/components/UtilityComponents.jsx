import React from "react";
import { observer } from "mobx-react-lite";

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