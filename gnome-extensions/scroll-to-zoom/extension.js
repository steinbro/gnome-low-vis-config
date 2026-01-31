import Clutter from 'gi://Clutter';
import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const MAG_SCHEMA = 'org.gnome.desktop.a11y.magnifier';
const MAG_KEY = 'mag-factor';
const ZOOM_STEP = 1.2;
const MIN_MAG = 1.0;
const MAX_MAG = 10.0;

export default class CtrlScrollMagnifierExtension {
    constructor() {
        this._settings = null;
        this._captureId = 0;
    }

    enable() {
        this._settings = new Gio.Settings({ schema: MAG_SCHEMA });
        this._captureId = global.stage.connect('captured-event', this._onEvent.bind(this));
        log('[scroll-to-zoom] enabled');
    }

    disable() {
        if (this._captureId) {
            global.stage.disconnect(this._captureId);
            this._captureId = 0;
        }
        this._settings = null;
        log('[scroll-to-zoom] disabled');
    }

    _onEvent(stage, event) {
        if (event.type() !== Clutter.EventType.SCROLL)
            return Clutter.EVENT_PROPAGATE;

        const state = event.get_state();
        if (!(state & Clutter.ModifierType.CONTROL_MASK))
            return Clutter.EVENT_PROPAGATE;

        const dir = event.get_scroll_direction();
        let mag = this._settings.get_double(MAG_KEY);

        if (dir === Clutter.ScrollDirection.UP)
            mag *= ZOOM_STEP;
        else if (dir === Clutter.ScrollDirection.DOWN)
            mag /= ZOOM_STEP;
        else
            return Clutter.EVENT_PROPAGATE;

        mag = Math.min(Math.max(mag, MIN_MAG), MAX_MAG);
        this._settings.set_double(MAG_KEY, mag);
        log(`[scroll-to-zoom] mag-factor set to ${mag}`);

        return Clutter.EVENT_STOP;
    }
}
