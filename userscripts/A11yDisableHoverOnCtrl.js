// ==UserScript==
// @name         Accessibility: Disable Hover on Ctrl
// @namespace    http://steinbro.github.io/
// @version      2026-04-21
// @description  Hold the Ctrl key to disable all mouseover effects. This is designed to work with screen magnifiers that use the mouse to move the zoom area, allowing users to explore the page without triggering hover elements that obscure the view.
// @author       Daniel W. Steinbrook <dsteinbrook@gmail.com>
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    let shield = null;

    // 1. Create the shield element
    function createShield() {
        shield = document.createElement('div');
        shield.id = 'gnome-magnifier-shield';
        // We use fixed positioning to cover the visible viewport
        Object.assign(shield.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '2147483647', // Maximum possible z-index
            backgroundColor: 'transparent',
            cursor: 'crosshair',
            display: 'none',
            pointerEvents: 'auto'
        });
        document.documentElement.appendChild(shield);
    }

    // 2. Event Listeners
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Control') {
            if (!shield) createShield();
            shield.style.display = 'block';

            // Optional: Block event propagation to be safe
            shield.onmousemove = (me) => me.stopImmediatePropagation();
        }
    }, true);

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Control' && shield) {
            shield.style.display = 'none';
        }
    }, true);

    // 3. Handle Edge Cases
    window.addEventListener('blur', () => {
        if (shield) shield.style.display = 'none';
    });

    // Initialize on start if body exists, otherwise wait
    if (document.body) createShield();
    else window.addEventListener('DOMContentLoaded', createShield);
})();