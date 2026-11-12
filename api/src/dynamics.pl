% ─── Dynamic facts ────────────────────────────────────────────────────────────
% These facts have no clauses at load time.
% They are populated at runtime by the Python ingestion layer via assertz/1.

:- dynamic disease/1.
:- dynamic disease_symptom/2.
:- dynamic disease_description/2.
:- dynamic disease_precaution/2.
:- dynamic symptom_weight/2.
