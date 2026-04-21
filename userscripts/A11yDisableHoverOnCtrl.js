// ==/UserScript==
// ==UserScript==
// @name         Accessibility: Disable Hover on Ctrl
// @namespace    http://steinbro.github.io/
// @version      2026-04-20
// @description  Prevents hover triggers while holding the Ctrl key to assist magnification users.
// @author       Daniel W. Steinbrook <dsteinbrook@gmail.com>
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. Intercept JavaScript Mouse Events
    const blockEvents = (e) => {
        if (e.ctrlKey) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    };

    // We use capture: true to catch the event before the website's own scripts see it
    window.addEventListener('mouseover', blockEvents, true);
    window.addEventListener('mouseenter', blockEvents, true);
    window.addEventListener('mousemove', blockEvents, true);

    // 2. Suppress CSS :hover effects
    // We inject a global style that kills pointer events when Ctrl is active
    const style = document.createElement('style');
    style.innerHTML = `
        html.ctrl-active * {
            pointer-events: none !important;
        }
    `;
    document.documentElement.appendChild(style);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Control') {
            document.documentElement.classList.add('ctrl-active');
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            document.documentElement.classList.remove('ctrl-active');
        }
    });
})();