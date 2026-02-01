import Gio from "gi://Gio";
import Adw from "gi://Adw";
import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class SpeechPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup({ title: "General Settings" });

    const row = new Adw.SwitchRow({
      title: "Show Panel Icon",
      subtitle: "Toggle the speech rate menu in the top bar",
    });

    // Bind the switch to our GSettings key
    const settings = this.getSettings(
      "org.gnome.shell.extensions.speak-selection",
    );
    settings.bind(
      "show-indicator",
      row,
      "active",
      Gio.SettingsBindFlags.DEFAULT,
    );

    group.add(row);
    page.add(group);
    window.add(page);
  }
}
