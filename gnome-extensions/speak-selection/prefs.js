import Gio from "gi://Gio";
import Adw from "gi://Adw";
import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class SpeechPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup({
      title: "Keyboard Shortcuts",
      description: "Set your preferred shortcuts for Speech Dispatcher",
    });

    // This adds a simple info row.
    // Note: For a full shortcut recorder, more complex widgetry is needed,
    // but this allows the "Settings" button to at least open.
    const row = new Adw.ActionRow({
      title: "Configure via Dconf or Shortcuts Settings",
      subtitle: "Standard GNOME shortcut recorder requires extra boilerplate.",
    });

    group.add(row);
    page.add(group);
    window.add(page);
  }
}
