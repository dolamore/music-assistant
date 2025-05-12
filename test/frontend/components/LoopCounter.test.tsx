import * as React from 'react';
import { render, screen, act } from '@testing-library/react'; // импортируем act отсюда
import LoopCounter from '../../../src/frontend/components/LoopCounter';
import { describe, expect, it } from "@jest/globals";
import { MetronomeManager } from "../../../src/frontend/managers/MetronomeManager";
import { observable } from 'mobx';

describe('LoopCounter', () => {
    it('should show the right amount of played cycles and update when loopCount changes', () => {
        const mockMetronomeManager = {
            audioEngine: observable({
                loopCount: 5
            })
        };

        render(<LoopCounter metronomeManager={mockMetronomeManager as MetronomeManager} />);

        expect(screen.getByText('5')).toBeInTheDocument();

        act(() => {
            mockMetronomeManager.audioEngine.loopCount = 8;
        });

        expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should update when store changes', () => {
        const metronomeManager = observable({
                audioEngine: {
                    loopCount: 5
                }
        });

        render(
                <LoopCounter metronomeManager={metronomeManager as MetronomeManager}/>
        );

        expect(screen.getByText('5')).toBeInTheDocument();

        act(() => {
            metronomeManager.audioEngine.loopCount = 12;
        });

        expect(screen.getByText('12')).toBeInTheDocument();
    });
});