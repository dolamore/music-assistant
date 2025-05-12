import * as React from 'react';
import { render, screen } from '@testing-library/react';
import LoopCounter from '../../../src/frontend/components/LoopCounter';
import {describe, expect, it} from "@jest/globals";
import {MetronomeManager} from "../../../src/frontend/managers/MetronomeManager";

const mockMetronomeManager = {
    audioEngine: {
        loopCount: 5
    }
};

describe('LoopCounter', () => {
    it('should show the right amount of played cycles', () => {
        render(<LoopCounter metronomeManager={mockMetronomeManager as MetronomeManager} />);

        // Проверяем, что счетчик отображает правильное значение
        expect(screen.getByText('5')).toBeInTheDocument();

        // Проверяем заголовок
        expect(screen.getByText('Loops played:')).toBeInTheDocument();
    });
});