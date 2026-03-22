#!/usr/bin/env python3

import importlib.util
from pathlib import Path
import subprocess
import unittest


EMOJI_AVAILABLE = importlib.util.find_spec("emoji") is not None
ROOT_DIR = Path(__file__).resolve().parents[1]
FORMAT_SPEAKABLE = ROOT_DIR / "format_speakable"
UCONV_AVAILABLE = subprocess.run(
    ["sh", "-c", "command -v uconv >/dev/null 2>&1"], check=False
).returncode == 0


@unittest.skipUnless(EMOJI_AVAILABLE, "python emoji package is not installed")
@unittest.skipUnless(UCONV_AVAILABLE, "uconv is not installed")
@unittest.skipUnless(FORMAT_SPEAKABLE.exists(), "format_speakable script is missing")
class TestReadSelectedTextEspeakNgConversion(unittest.TestCase):
    def convert_for_speech(self, text: str) -> str:
        """Invoke the shared preprocessor used by espeak and espeak-ng scripts."""
        output = subprocess.run(
            [str(FORMAT_SPEAKABLE)],
            input=text,
            text=True,
            capture_output=True,
            check=True,
        ).stdout
        return " ".join(output.split())

    def test_emoji_is_demojized(self) -> None:
        output = self.convert_for_speech("Hi 😀")
        self.assertEqual("Hi grinning_face", output)
        self.assertNotIn("😀", output)

    def test_unicode_math_is_normalized(self) -> None:
        output = self.convert_for_speech("Solve 𝒙 + 𝟚 = 𝟛")
        self.assertEqual("Solve x + 2 = 3", output)
        self.assertNotIn("𝒙", output)
        self.assertNotIn("𝟚", output)
        self.assertNotIn("𝟛", output)

    def test_mixed_emoji_and_math_text(self) -> None:
        output = self.convert_for_speech("Result ✅: 𝟜/𝟚 = 𝟚")
        self.assertEqual("Result check_mark_button : 4/2 = 2", output)
        self.assertNotIn("✅", output)


if __name__ == "__main__":
    unittest.main()
