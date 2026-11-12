% ─── Entry point ──────────────────────────────────────────────────────────────
% Load all modules. SWI-Prolog resolves paths relative to this file's directory.

:- [dynamics].
:- [knowledge_base].
:- [inference].


% ─── Specialist recommendation ────────────────────────────────────────────────
% Returns the recommended specialist for a disease.
% Falls back to general_practitioner if no category is defined.

recommend_specialist(Disease, Specialist) :-
    disease_category(Disease, Category),
    specialist_for_category(Category, Specialist),
    !.
recommend_specialist(_, 'general practitioner').


% ─── Diagnosis ────────────────────────────────────────────────────────────────
% Returns the top Limit diseases ranked by score as [Score, Disease] pairs.
% Using a list (instead of Score-Disease) allows pyswip to parse results natively.

diagnose(ReportedSymptoms, Limit, Results) :-
    findall([Score, Disease],
        (disease(Disease), score(Disease, ReportedSymptoms, Score)),
        AllScores),
    msort(AllScores, Sorted),
    reverse(Sorted, Ranked),
    length(Ranked, Total),
    ActualLimit is min(Limit, Total),
    length(Results, ActualLimit),
    append(Results, _, Ranked).
