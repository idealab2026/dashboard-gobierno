from _local import emit_local

COLUMN_MAP = {
    "año": "year",
    "grupo_sec": "sec_group",
    "subsector": "subsector",
    "figura": "tax_figure",
    "valor_mill_eur": "value_mill_eur",
    "es_exhaustivo": "is_exhaustive",
    "es_sumable_en_sankey": "is_summable_in_sankey",
    "fuente_oficial": "source",
    "url_verificable": "source_url",
    "vintage": "vintage",
    "notas": "notes",
}

emit_local("figuras_ingresos_2024.csv", COLUMN_MAP)
