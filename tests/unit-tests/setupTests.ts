import '@testing-library/jest-dom';
import { configure } from 'mobx';

if (typeof window !== 'undefined') {
    window.requestAnimationFrame = callback => {
        return setTimeout(callback, 0);
    };

    window.cancelAnimationFrame = id => {
        clearTimeout(id);
    };
}

configure({
    enforceActions: 'never',
    computedRequiresReaction: false,
    reactionRequiresObservable: false,
    observableRequiresReaction: false
});