This repository contains some enhancements to the default GNOME magnification and speech settings on Ubuntu 25.04.

## Speak selection with modern text-to-speech voices

Update to [this 2021 post](https://dev.to/tylerlwsmith/read-selected-text-out-loud-on-ubuntu-linux-45lj) using the much more natural-sounding [Piper](https://github.com/rhasspy/piper) text-to-speech engine.

1. Install Piper TTS. Piper's dependencies can be picky about Python version, so using uv as the package manager can be helpful since it can manage the Python itnerpreter version as well.

        $ sudo apt install python-astral-uv
        $ mkdir ~/piper && cd ~/piper
        $ uv init --python 3.11
        $ uv tool install piper-tts
2. Download voices from https://github.com/rhasspy/piper/blob/master/VOICES.md In our example, we use the US English voice lessac medium, and store both the model (.onmx) and config (.json) in ~/piper.
3. Confirm you can generate and play speech on demand:

        $ echo "hi" | piper --model ~/piper/en_US-lessac-medium.onnx | aplay -r 22050 -f S16_LE -t raw -
4. Follow all the steps from the above blog post, but drop in the `read-selected-text` script from this repository instead of the `espeak`-based script.

## Full-screen magnification

The configuration for the GNOME built-in screen magnifier can be tweaked beyond what's shown in the settings UI, as described in this post: https://superuser.com/a/1713208

### Adjust behavior

To reduce jumping, disable caret tracking and focus tracking like so:

    $  gsettings set org.gnome.desktop.a11y.magnifier caret-tracking none
    $  gsettings set org.gnome.desktop.a11y.magnifier focus-tracking none

### Set mouse shortcuts

The keyboard shortcuyts to increase/decrease zoom are by default bound to Alt+Super+= and Alt+Super+- respectively. It can be convenient to have a mouse shortcut as well.

#### Option 1: GNOME extension

Just install the [Better Desktop Zoom extension](https://extensions.gnome.org/extension/7263/better-desktop-zoom/) to enable zoom via  Ctrl + Super + scroll. Scroll here includes both the scroll wheel on a traditional mouse, or two-finger vertical motion on a touchpad.

#### Option 2: Input Remapper

The documented technique using `xbindkeys` only works on X11, not Wayland. For an explanation, see [Why does xbindkeys not get the thumbwheel mouse buttons of Logitech MX Master anymore?](https://unix.stackexchange.com/a/785901)

Following the suggestion to use InputRemapper, here's how to map increase/decrease zoom actions to the back/forward buttons on a Logitech MX Vertical mouse:

1. Install Input Remapper:
    
        $ sudo apt install input-remapper

2. Launch the Input Remapper GUI, and create a new preset for Logitech MX Vertical Advanced Ergonomic Mouse. Make sure the "Autoload" toggle is enabled.
3. Add two inputs on the left. Use the Record button to capture pressing the relevant mouse buttons, which should be shown as "Button EXTRA" and "Button SIDE".
4. For output, select Type "Key or Macro" and target "keyboard".
    1. For input "Button EXTRA", use output "Alt_L+Super_L+equal".
    2. For input "Button SIDE", use output "A;t_L+Super_L+minux".

The resulting configuration file is normally generated under ~/.config/input-remapper-2/. An example after following the above steps is found in this repository under input-remapper-2. 
