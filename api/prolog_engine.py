import csv
import os
from pyswip import Prolog

_prolog = None


def _pl_atom(s: str) -> str:
    """Wrap a string as a quoted Prolog atom, escaping backslashes and single quotes."""
    escaped = s.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{escaped}'"


def _normalize(s: str) -> str:
    return s.strip().lower()


def _load_data(prolog: Prolog) -> None:
    data_dir = os.path.join(os.path.dirname(__file__), "data")

    seen_diseases: set[str] = set()
    seen_pairs: set[tuple[str, str]] = set()

    # dataset.csv → disease/1, disease_symptom/2
    with open(os.path.join(data_dir, "dataset.csv"), newline="", encoding="utf-8") as f:
        for row in csv.reader(f):
            if not row:
                continue
            disease = _normalize(row[0])
            if not disease or disease == "disease":
                continue
            if disease not in seen_diseases:
                seen_diseases.add(disease)
                list(prolog.query(f"assertz(disease({_pl_atom(disease)}))"))
            for raw in row[1:]:
                symptom = _normalize(raw)
                if symptom and (disease, symptom) not in seen_pairs:
                    seen_pairs.add((disease, symptom))
                    list(prolog.query(
                        f"assertz(disease_symptom({_pl_atom(disease)}, {_pl_atom(symptom)}))"
                    ))

    # symptom_description.csv → disease_description/2
    with open(os.path.join(data_dir, "symptom_description.csv"), newline="", encoding="utf-8") as f:
        for row in csv.reader(f):
            if len(row) < 2:
                continue
            disease = _normalize(row[0])
            if not disease or disease == "disease":
                continue
            desc = row[1].strip()
            if desc:
                list(prolog.query(
                    f"assertz(disease_description({_pl_atom(disease)}, {_pl_atom(desc)}))"
                ))

    # symptom_precaution.csv → disease_precaution/2
    with open(os.path.join(data_dir, "symptom_precaution.csv"), newline="", encoding="utf-8") as f:
        for row in csv.reader(f):
            if not row:
                continue
            disease = _normalize(row[0])
            if not disease or disease == "disease":
                continue
            precs = [p.strip() for p in row[1:] if p.strip()]
            if precs:
                precs_pl = "[" + ", ".join(_pl_atom(p) for p in precs) + "]"
                list(prolog.query(
                    f"assertz(disease_precaution({_pl_atom(disease)}, {precs_pl}))"
                ))

    # symptom_severity.csv → symptom_weight/2
    with open(os.path.join(data_dir, "symptom_severity.csv"), newline="", encoding="utf-8") as f:
        for row in csv.reader(f):
            if len(row) < 2:
                continue
            symptom = _normalize(row[0])
            if not symptom or symptom == "symptom":
                continue
            try:
                weight = int(row[1].strip())
            except ValueError:
                continue
            list(prolog.query(f"assertz(symptom_weight({_pl_atom(symptom)}, {weight}))"))

    print(f"[ ingest ] {len(seen_diseases)} diseases, {len(seen_pairs)} disease-symptom relations loaded")


def get_prolog() -> Prolog:
    global _prolog
    if _prolog is None:
        _prolog = Prolog()
        src_dir = os.path.join(os.path.dirname(__file__), "src")
        _prolog.consult(os.path.join(src_dir, "diagnosis.pl"))
        _load_data(_prolog)
    return _prolog


def get_symptoms() -> list[dict]:
    prolog = get_prolog()
    results = list(prolog.query("setof(S, D^disease_symptom(D, S), Symptoms)"))
    if not results:
        return []
    out = []
    for s in results[0]["Symptoms"]:
        s_str = str(s)
        weight_q = list(prolog.query(f"symptom_weight({_pl_atom(s_str)}, W)"))
        weight = int(weight_q[0]["W"]) if weight_q else 1
        out.append({"name": s_str, "weight": weight})
    return out


def get_diseases() -> list[dict]:
    prolog = get_prolog()
    results = list(prolog.query("setof(D, disease(D), Diseases)"))
    if not results:
        return []
    out = []
    for d in results[0]["Diseases"]:
        d_str = str(d)
        desc_q = list(prolog.query(f"disease_description({_pl_atom(d_str)}, Desc)"))
        desc = str(desc_q[0]["Desc"]) if desc_q else ""
        out.append({"name": d_str, "description": desc})
    return out


def diagnose(symptoms: list[str], limit: int = 5) -> list[dict]:
    prolog = get_prolog()
    symptoms_pl = "[" + ", ".join(_pl_atom(s) for s in symptoms) + "]"
    query = f"diagnose({symptoms_pl}, {limit}, Results)"
    results = list(prolog.query(query))
    if not results:
        return []

    out = []
    for item in results[0]["Results"]:
        # Each item is a [Score, Disease] Prolog list, returned as a Python list by pyswip
        score = float(item[0])
        disease = str(item[1])

        desc_q = list(prolog.query(f"disease_description({_pl_atom(disease)}, Desc)"))
        description = str(desc_q[0]["Desc"]) if desc_q else ""

        prec_q = list(prolog.query(f"disease_precaution({_pl_atom(disease)}, Precs)"))
        precautions = [str(p) for p in prec_q[0]["Precs"]] if prec_q else []

        symp_q = list(prolog.query(f"disease_symptom({_pl_atom(disease)}, S)"))
        disease_symptoms = list({str(r["S"]) for r in symp_q})

        spec_q = list(prolog.query(f"recommend_specialist({_pl_atom(disease)}, Spec)"))
        specialist = str(spec_q[0]["Spec"]) if spec_q else "general practitioner"

        sev_q = list(prolog.query(f"classify_severity({score}, Sev)"))
        severity = str(sev_q[0]["Sev"]) if sev_q else "low"

        out.append({
            "name": disease,
            "confidence": round(score),
            "severity": severity,
            "specialist": specialist,
            "description": description,
            "precautions": precautions,
            "symptoms": disease_symptoms,
        })
    return out
