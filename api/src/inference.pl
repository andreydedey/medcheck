% ─── Guards ───────────────────────────────────────────────────────────────────

% Succeeds if every required symptom for Disease is present in ReportedSymptoms.
satisfies_required(Disease, ReportedSymptoms) :-
    \+ (required_symptom(Disease, Required), \+ member(Required, ReportedSymptoms)).

% Succeeds if no reported symptom contraindicates Disease.
not_excluded(Disease, ReportedSymptoms) :-
    \+ (contraindicated_symptom(Disease, Symptom), member(Symptom, ReportedSymptoms)).


% ─── Severity classification ──────────────────────────────────────────────────
% Classifies a diagnosis confidence score into an urgency level.

classify_severity(Score, urgent)   :- Score >= 70, !.
classify_severity(Score, moderate) :- Score >= 40, !.
classify_severity(_,     low).


% ─── Scoring ──────────────────────────────────────────────────────────────────

% Returns the weight of a symptom; defaults to 1 if not in the knowledge base.
weight_of(Symptom, Weight) :-
    (symptom_weight(Symptom, Weight) -> true ; Weight = 1).

% Helper: succeeds if X is a member of List (argument order flipped for maplist).
member_(List, X) :- member(X, List).

% Computes a weighted overlap score (0–100) between reported and disease symptoms.
% Fails if required symptoms are absent or a contraindicated symptom is present.
score(Disease, ReportedSymptoms, Score) :-
    satisfies_required(Disease, ReportedSymptoms),
    not_excluded(Disease, ReportedSymptoms),
    findall(S, disease_symptom(Disease, S), DiseaseSymptoms),
    DiseaseSymptoms \= [],
    include(member_(DiseaseSymptoms), ReportedSymptoms, Matched),
    Matched \= [],
    maplist(weight_of, Matched, MatchedWeights),
    maplist(weight_of, DiseaseSymptoms, AllWeights),
    sumlist(MatchedWeights, MatchedSum),
    sumlist(AllWeights, TotalSum),
    TotalSum > 0,
    Score is (MatchedSum / TotalSum) * 100.
