import St from "gi://St";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import Shell from "gi://Shell";
import Meta from "gi://Meta";

const KEY_SPEAK = "run-speech";
const KEY_STOP = "stop-speech";

export default class SpeechExtension extends Extension {
  enable() {
    this._settings = this.getSettings(
      "org.gnome.shell.extensions.speak-selection",
    );

    // Register Speak Shortcut
    Main.wm.addKeybinding(
      KEY_SPEAK,
      this._settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
      () => this._speakSelection(),
    );

    // Register Stop Shortcut
    Main.wm.addKeybinding(
      KEY_STOP,
      this._settings,
      Meta.KeyBindingFlags.NONE,
      Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
      () => this._runCommand("spd-say -S"),
    );
  }

  disable() {
    Main.wm.removeKeybinding(KEY_SPEAK);
    Main.wm.removeKeybinding(KEY_STOP);
    this._settings = null;
  }

  _runCommand(command) {
    try {
      GLib.spawn_command_line_async(command);
    } catch (e) {
      console.error(`Speech Extension Error: ${e.message}`);
    }
  }

  _speakSelection() {
    const clipboard = St.Clipboard.get_default();
    clipboard.get_text(St.ClipboardType.PRIMARY, (clipboard, text) => {
      if (!text || text.trim() === "") return;

      // Sanitize text: escape quotes for shell safety
      const sanitizedText = text.replace(/"/g, '\\"');
      this._runCommand(`spd-say "${sanitizedText}"`);
    });
  }
}
