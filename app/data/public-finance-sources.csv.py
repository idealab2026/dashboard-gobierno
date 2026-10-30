from _local import emit_local

COLUMN_MAP = {
    "source_id": "source_id",
    "organismo": "organization",
    "titulo": "title",
    "url": "url",
    "uso_en_laboratorio": "use_in_laboratory",
    "vintage_o_fecha": "vintage_or_date",
    "caracter": "character",
    "notas": "notes",
}

emit_local("dim_fuentes_finanzas_publicas.csv", COLUMN_MAP)
