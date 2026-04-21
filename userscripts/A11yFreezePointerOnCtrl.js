// ==UserScript==
// @name         Accessibility: Freeze Pointer on Ctrl
// @namespace    http://steinbro.github.io/
// @version      2026-04-20
// @description  Freezes the mouse position from the website's perspective when Ctrl is held.
// @author       Daniel W. Steinbrook <dsteinbrook@gmail.com>
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let isFrozen = false;

    // The Event Interceptor
    const freezeHandler = (e) => {
        if (isFrozen) {
            // This stops the website's JS from seeing the movement
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    };

    // We catch these at the capture phase (top-down)
    window.addEventListener('mousemove', freezeHandler, true);
    window.addEventListener('mouseover', freezeHandler, true);
    window.addEventListener('mouseout', freezeHandler, true);
    window.addEventListener('mouseenter', freezeHandler, true);
    window.addEventListener('mouseleave', freezeHandler, true);

    // Key Listeners
    window.addEventListener('keydown', (e) => {
        // Only trigger once per press
        if (e.key === 'Control' && !isFrozen) {
            isFrozen = true;
            document.documentElement.classList.add('pointer-frozen');
        }
    }, true);

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            isFrozen = false;
            document.documentElement.classList.remove('pointer-frozen');
        }
    }, true);

    // Emergency reset
    window.addEventListener('blur', () => {
        isFrozen = false;
        document.documentElement.classList.remove('pointer-frozen');
    });
})();