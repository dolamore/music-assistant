import * as React from 'react';
import {render, screen, act} from '@testing-library/react';
import LoopCounter from '../../../../src/frontend/components/LoopCounter';
import {describe, expect, it} from '@jest/globals';
import {observable} from 'mobx';
import {MetronomeManager} from '../../../../src/frontend/managers/MetronomeManager';

describe('LoopCounter', () => {
    it('renders and updates when loopCount changes', () => {
        const mockMetronomeManager = observable({
            audioEngine: {
                loopCount: 5,
            },
        }) as MetronomeManager;

        render(<LoopCounter metronomeManager={mockMetronomeManager}/>);

        expect(screen.getByTestId('loop-counter')).toHaveTextContent('5');

        act(() => {
            mockMetronomeManager.audioEngine.loopCount = 8;
        });

        expect(screen.getByTestId('loop-counter')).toHaveTextContent('8');
    });
});
