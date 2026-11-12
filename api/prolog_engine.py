import os
from pyswip import Prolog

_prolog = None

def get_prolog() -> Prolog:
    global _prolog
    if _prolog is None:
        _prolog = Prolog()
        src_dir = os.path.join(os.path.dirname(__file__), "src")
        _prolog.consult(os.path.join(src_dir, "ingest.pl"))
        _prolog.consult(os.path.join(src_dir, "diagnostico.pl"))
        list(_prolog.query("carregar_dados"))
    return _prolog


def listar_sintomas() -> list[dict]:
    prolog = get_prolog()
    results = list(prolog.query("listar_sintomas(Sintomas)"))
    if not results:
        return []
    sintomas = results[0]["Sintomas"]
    out = []
    for s in sintomas:
        peso_q = list(prolog.query(f"peso_sintoma({s}, P)"))
        peso = int(peso_q[0]["P"]) if peso_q else 1
        out.append({"nome": str(s), "peso": peso})
    return out


def listar_doencas() -> list[dict]:
    prolog = get_prolog()
    results = list(prolog.query("listar_doencas(Doencas)"))
    if not results:
        return []
    doencas = results[0]["Doencas"]
    out = []
    for d in doencas:
        desc_q = list(prolog.query(f"descricao_doenca({d}, Desc)"))
        desc = str(desc_q[0]["Desc"]) if desc_q else ""
        out.append({"nome": str(d), "descricao": desc})
    return out


def diagnosticar(sintomas: list[str], limite: int = 5) -> list[dict]:
    prolog = get_prolog()
    lista_pl = "[" + ",".join(sintomas) + "]"
    query = f"diagnosticar({lista_pl}, {limite}, Resultados)"
    results = list(prolog.query(query))
    if not results:
        return []

    out = []
    for item in results[0]["Resultados"]:
        # pyswip retorna como string '-(score, doenca)'
        s = str(item).strip()
        s = s.lstrip("-").lstrip("(").rstrip(")")
        parts = s.split(",", 1)
        score = float(parts[0].strip())
        doenca = parts[1].strip()

        d = doenca.replace("'", "\\'")
        desc_q = list(prolog.query(f"descricao_doenca('{d}', Desc)"))
        desc = str(desc_q[0]["Desc"]) if desc_q else ""

        prec_q = list(prolog.query(f"precaucao_doenca('{d}', Precs)"))
        precaucoes = [str(p) for p in prec_q[0]["Precs"]] if prec_q else []

        sint_q = list(prolog.query(f"sintoma_doenca('{d}', S)"))
        sintomas_doenca = list({str(r["S"]) for r in sint_q})

        out.append({
            "nome": doenca,
            "confianca": round(score),
            "descricao": desc,
            "precaucoes": precaucoes,
            "sintomas": sintomas_doenca,
        })
    return out
