import React, { ReactElement } from "react";

/**
 * Metronome component that serves as a wrapper for the metronome application.
 * @param {ReactElement} children - The child components to be rendered inside the Metronome component.
 * @returns {ReactElement} The rendered Metronome component.
 */
function Metronome({ children }: { children: ReactElement[] }): ReactElement {
  return <div>{children}</div>;
}

export default Metronome;
