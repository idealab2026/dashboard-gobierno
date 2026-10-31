import sys,unittest
from datetime import date
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from campaign import all_scheduled,next_posts,preview
from prepare_publication import validate
class EditorialCampaignTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.posts=all_scheduled()
    def test_eight_posts_prepared(self):
        self.assertEqual(len(self.posts),8)
        self.assertEqual(len({p["id"] for p in self.posts}),8)
        self.assertEqual(len({p["text"] for p in self.posts}),8)
        self.assertEqual(self.posts[0]["planned_date"],"2026-11-02")
        self.assertEqual(self.posts[-1]["planned_date"],"2026-11-15")
    def test_every_post_requires_review_and_has_source(self):
        for p in self.posts:
            t,n=validate(p)
            self.assertLessEqual(n,280)
            self.assertEqual(p["account"],"@LARREALIDAD")
            self.assertEqual(p["status"],"review_pending")
            self.assertTrue(p["source_verified"])
            self.assertTrue(p["editorial_notes"])
    def test_seven_day_windows(self):
        self.assertEqual(len(next_posts(self.posts,date(2026,11,2),7)),4)
        self.assertEqual(len(next_posts(self.posts,date(2026,11,9),7)),4)
        self.assertEqual(next_posts(self.posts,date(2026,11,16),7),[])
    def test_review_only_preview(self):
        output=preview(self.posts,date(2026,11,2),7)
        self.assertIn("NO PUBLICADO EN X",output)
        self.assertIn("intent/tweet?text=",output)
        self.assertIn("Fuente original",output)
        self.assertNotIn("Bearer ",output)
    def test_sources_approved(self):
        self.assertTrue(any("igae.pap.hacienda.gob.es" in p["source_url"] for p in self.posts))
        self.assertTrue(any("idealab2026.github.io" in p["source_url"] for p in self.posts))
if __name__=="__main__":
    unittest.main()
