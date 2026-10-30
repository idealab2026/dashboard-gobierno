import copy
import unittest
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
import update_ine_ecp320 as mod

class PopulationSyncTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.columns,cls.rows=mod.read_csv()
        cls.pops={int(r["year"]):int(r["value"]) for r in cls.rows
                  if r["indicator_id"]=="poblacion_residente" and r["geo_name"]=="España"}
        cls.latest=max(cls.pops)
        cls.history={x:cls.pops[x] for x in sorted(cls.pops)[-3:]}
    def test_official_identifier_is_strict(self):
        p={"COD":"ECP319","Nombre":mod.TITLE,"Data":[{"Anyo":2024,"Valor":48_619_695},{"Anyo":2025,"Valor":49_128_297}]}
        with self.assertRaises(mod.OfficialDataError):mod.parse_series(p)
        p["COD"]=mod.CODE;p["Nombre"]="Total Nacional. Hombres. Población"
        with self.assertRaises(mod.OfficialDataError):mod.parse_series(p)
    def test_same_values_never_modify(self):
        originals=copy.deepcopy(self.rows)
        rows,new=mod.apply_official(self.history,self.columns,originals)
        self.assertEqual(new,[])
        self.assertEqual(rows,originals)
    def test_append_next_year_and_derived_growth(self):
        nextyear=self.latest+1
        newer={**self.history,nextyear:self.pops[self.latest]+400_000}
        rows,new=mod.apply_official(newer,self.columns,copy.deepcopy(self.rows))
        self.assertEqual(len(new),1)
        self.assertEqual(len(rows),len(self.rows)+2)
        actual=[x for x in rows if x["year"]==str(nextyear) and x["indicator_id"]=="poblacion_residente"]
        self.assertEqual(len(actual),1)
        self.assertEqual(actual[0]["source"],"INE · ECP320 (serie nacional fijada)")
        self.assertEqual(actual[0]["value"],str(newer[nextyear]))
        growth=[x for x in rows if x["year"]==str(nextyear) and x["indicator_id"]=="crecimiento_poblacion"]
        self.assertEqual(len(growth),1)
        self.assertEqual(growth[0]["status"],"calculado")
    def test_past_revision_blocks_publication(self):
        bad=dict(self.history);bad[self.latest]+=1
        with self.assertRaises(mod.OfficialDataError):
            mod.apply_official(bad,self.columns,copy.deepcopy(self.rows))
    def test_large_jump_blocks(self):
        newer={**self.history,self.latest+1:int(self.pops[self.latest]*1.12)}
        with self.assertRaises(mod.OfficialDataError):
            mod.apply_official(newer,self.columns,copy.deepcopy(self.rows))
    def test_missing_year_blocks(self):
        newer={**self.history,self.latest+2:self.pops[self.latest]+300_000}
        with self.assertRaises(mod.OfficialDataError):
            mod.apply_official(newer,self.columns,copy.deepcopy(self.rows))
if __name__=="__main__":unittest.main()
