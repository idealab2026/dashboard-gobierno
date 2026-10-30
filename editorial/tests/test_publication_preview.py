import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from prepare_publication import validate, render

DRAFT = json.loads((Path(__file__).resolve().parents[1] / "drafts" / "2026-10-30-primera-prueba.json").read_text(encoding="utf-8"))


class PublicationPreviewTests(unittest.TestCase):
    def test_first_draft_is_valid(self):
        text, count = validate(DRAFT)
        self.assertEqual(len(text), count)
        self.assertLessEqual(count, 280)

    def test_read_only_preview(self):
        output = render(DRAFT)
        self.assertIn("NO PUBLICADO EN X", output)
        self.assertIn("https://twitter.com/intent/tweet?text=", output)

    def test_trusted_sankey_link_is_allowed(self):
        sankey = json.loads((Path(__file__).resolve().parents[1] / "drafts" / "2026-10-30-presentacion-sankey.json").read_text(encoding="utf-8"))
        validated_text, count = validate(sankey)
        self.assertIn("idealab2026.github.io/dashboard-gobierno/#mapa-dinero", validated_text)
        self.assertLessEqual(count, 280)

    def test_rejects_external_link(self):
        with self.assertRaises(ValueError):
            validate({**DRAFT, "text": "https://otro-dominio.example/"})

    def test_rejects_unapproved(self):
        with self.assertRaises(ValueError):
            validate({**DRAFT, "status": "auto_publish"})

    def test_rejects_long_post(self):
        with self.assertRaises(ValueError):
            validate({**DRAFT, "text": "x" * 281})


if __name__ == "__main__":
    unittest.main()
