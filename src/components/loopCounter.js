import React, {useState} from "react";

export default function LoopCounter({metronomeManager}) {
    const [loopCounter, setLoopCounter] = useState(0);
    return (
        <div className="loop-counter-container">
            <label htmlFor="loop-counter">Loops played:</label>
            <div id="loop-counter">{loopCounter}</div>
        </div>
    );
}