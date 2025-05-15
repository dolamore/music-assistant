import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import * as Tone from "tone";
import { useAudioContextUnlocker } from "../../../../src/frontend/utils/audioContext";
import { AudioContextProvider } from "../../../../src/frontend/components/AudioContextProvider";

jest.mock("../../../../src/frontend/utils/audioContext", () => ({
    useAudioContextUnlocker: jest.fn(),
}));

jest.mock("tone", () => ({
    start: jest.fn(),
    getContext: jest.fn().mockReturnValue({
        state: "suspended",
    }),
}));

describe("AudioContextProvider", () => {
    const TestComponent = () => {
        React.useEffect(() => {
            if (Tone.getContext().state === "suspended") {
                console.error(
                    new Error("The AudioContext is 'suspended'. Invoke Tone.start() from a user action to start the audio.")
                );
            }
        }, []);

        return <div data-testid="test-child">Test component</div>;
    };

    const mockUnlockAudioContext = jest.fn().mockImplementation(async () => {
        const context: any = Tone.getContext();
        context.state = 'running'; // симуляция изменения состояния
        await Tone.start(); // вызываем Tone.start() здесь
    });

    const getMockContext = () => {
        const context = { state: "suspended" };
        (Tone.getContext as jest.Mock).mockReturnValue(context);
        return context;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getMockContext();
        (useAudioContextUnlocker as jest.Mock).mockReturnValue(mockUnlockAudioContext);

        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
    });

    it("should cause AudioContext error without AudioContextProvider", () => {
        render(<TestComponent />);

        expect(console.error).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining("The AudioContext is 'suspended'"),
            })
        );
    });

    it("should not cause AudioContext error after user's interaction with provider", async () => {
        render(
            <AudioContextProvider>
                <TestComponent />
            </AudioContextProvider>
        );

        expect(console.error).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining("The AudioContext is 'suspended'"),
            })
        );

        (console.error as jest.Mock).mockClear();

        await act(async () => {
            fireEvent.click(screen.getByTestId("test-child"));
        });

        // Проверяем, что Tone.start был вызван
        expect(Tone.start).toHaveBeenCalledTimes(1);
        expect(mockUnlockAudioContext).toHaveBeenCalledTimes(1);

        expect(Tone.getContext().state).toBe("running");

        render(
            <AudioContextProvider>
                <TestComponent />
            </AudioContextProvider>
        );

        expect(console.error).not.toHaveBeenCalled();
    });

    it("should delete listeners after the first click", async () => {
        const addEventListenerSpy = jest.spyOn(window, "addEventListener");
        const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

        render(
            <AudioContextProvider>
                <TestComponent />
            </AudioContextProvider>
        );

        expect(addEventListenerSpy).toHaveBeenCalledTimes(5);

        await act(async () => {
            fireEvent.click(screen.getByTestId("test-child"));
        });

        expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.anything());
        expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.anything());
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.anything());
        expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.anything());
        expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.anything());

        addEventListenerSpy.mockClear();
        removeEventListenerSpy.mockClear();
        mockUnlockAudioContext.mockClear();

        await act(async () => {
            fireEvent.click(screen.getByTestId("test-child"));
        });

        expect(mockUnlockAudioContext).not.toHaveBeenCalled();
        expect(addEventListenerSpy).not.toHaveBeenCalled();
        expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    it("should work with all the user's interactions", async () => {
        const events = [
            { name: "click", action: () => fireEvent.click(screen.getByTestId("test-child")) },
            { name: "touchstart", action: () => fireEvent.touchStart(screen.getByTestId("test-child")) },
            { name: "keydown", action: () => fireEvent.keyDown(screen.getByTestId("test-child"), { key: "Space" }) },
            { name: "mousedown", action: () => fireEvent.mouseDown(screen.getByTestId("test-child")) },
            { name: "pointerdown", action: () => fireEvent.pointerDown(screen.getByTestId("test-child")) },
        ];

        for (const event of events) {
            jest.clearAllMocks();
            (Tone.getContext() as any).state = "suspended";

            const { unmount } = render(
                <AudioContextProvider>
                    <TestComponent />
                </AudioContextProvider>
            );

            (console.error as jest.Mock).mockClear();

            await act(async () => {
                event.action();
            });

            // Проверяем, что Tone.start был вызван
            expect(mockUnlockAudioContext).toHaveBeenCalledTimes(1);

            expect(Tone.getContext().state).toBe("running");

            unmount();
        }
    });
});
