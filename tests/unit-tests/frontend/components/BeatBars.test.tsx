import {observable} from "mobx";
import {MetronomeManager} from "../../../../src/frontend/managers/MetronomeManager";
import Beat from "../../../../src/frontend/models/Beat";
import {createDefaultSoundObject} from "../../../../src/frontend/vars/sounds/DEFAULT_SOUNDS";
import {DEFAULT_NOTE_AMOUNT, getDefaultNote} from "../../../../src/frontend/vars/vars";
import {act, fireEvent, render, screen} from "@testing-library/react";
import * as React from "react";
import BeatBars from "../../../../src/frontend/components/BeatBars";
import {TonejsEngine} from "../../../../src/frontend/audio-engine/engines/TonejsEngine";

const mockBeat = new Beat(
    createDefaultSoundObject(),
    getDefaultNote(),
    DEFAULT_NOTE_AMOUNT,
    0);

describe('BeatBars', () => {
    it('change note size dropdown will change tonejs sequence', async () => {
        const mockMetronomeManager = observable({
            audioEngine: {
                beatSequence: [mockBeat],
            } as unknown as TonejsEngine,
        }) as unknown as MetronomeManager;

        render(<BeatBars metronomeManager={mockMetronomeManager}/>);

        expect(mockMetronomeManager.audioEngine.beatSequence[0].noteSettings.note).toEqual("4n");
        await act(async () => {
            fireEvent.click(screen.getByTestId("note-amount-dropdown-0"));
        });
    });
});