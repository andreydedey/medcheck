% ─── Dynamic facts (populated by Python ingestion layer) ─────────────────────
:- dynamic disease/1.
:- dynamic disease_symptom/2.
:- dynamic disease_description/2.
:- dynamic disease_precaution/2.
:- dynamic symptom_weight/2.


% ─── Disease categories ───────────────────────────────────────────────────────
disease_category('fungal infection',                       skin).
disease_category(acne,                                     skin).
disease_category(psoriasis,                                skin).
disease_category(impetigo,                                 skin).
disease_category(allergy,                                  allergy).
disease_category('drug reaction',                          allergy).
disease_category('chicken pox',                            infectious).
disease_category(malaria,                                  infectious).
disease_category(dengue,                                   infectious).
disease_category(typhoid,                                  infectious).
disease_category('hepatitis a',                            infectious).
disease_category('hepatitis b',                            infectious).
disease_category('hepatitis c',                            infectious).
disease_category('hepatitis d',                            infectious).
disease_category('hepatitis e',                            infectious).
disease_category(aids,                                     infectious).
disease_category(tuberculosis,                             respiratory).
disease_category('bronchial asthma',                       respiratory).
disease_category('common cold',                            respiratory).
disease_category(pneumonia,                                respiratory).
disease_category(hypertension,                             cardiac).
disease_category('heart attack',                           cardiac).
disease_category('varicose veins',                         cardiac).
disease_category(migraine,                                 neurological).
disease_category('cervical spondylosis',                   neurological).
disease_category('paralysis (brain hemorrhage)',           neurological).
disease_category('(vertigo) paroymsal  positional vertigo', neurological).
disease_category(gerd,                                     gastric).
disease_category('chronic cholestasis',                    gastric).
disease_category('peptic ulcer diseae',                    gastric).
disease_category(gastroenteritis,                          gastric).
disease_category('alcoholic hepatitis',                    gastric).
disease_category(jaundice,                                 gastric).
disease_category('dimorphic hemmorhoids(piles)',           gastric).
disease_category(diabetes,                                 endocrine).
disease_category(hypothyroidism,                           endocrine).
disease_category(hyperthyroidism,                          endocrine).
disease_category(hypoglycemia,                             endocrine).
disease_category(osteoarthristis,                          musculoskeletal).
disease_category(arthritis,                                musculoskeletal).
disease_category('urinary tract infection',                urinary).


% ─── Specialist per category ─────────────────────────────────────────────────
specialist_for_category(skin,            dermatologist).
specialist_for_category(allergy,         allergist).
specialist_for_category(infectious,      infectologist).
specialist_for_category(respiratory,     pulmonologist).
specialist_for_category(cardiac,         cardiologist).
specialist_for_category(neurological,    neurologist).
specialist_for_category(gastric,         gastroenterologist).
specialist_for_category(endocrine,       endocrinologist).
specialist_for_category(musculoskeletal, orthopedist).
specialist_for_category(urinary,         urologist).

% Returns the recommended specialist for a disease.
% Falls back to general_practitioner if no category is defined.
recommend_specialist(Disease, Specialist) :-
    disease_category(Disease, Category),
    specialist_for_category(Category, Specialist),
    !.
recommend_specialist(_, 'general practitioner').


% ─── Mandatory symptoms ───────────────────────────────────────────────────────
% A disease is only scored if ALL of its required symptoms are reported.
required_symptom(malaria,              chills).
required_symptom(malaria,              fever).
required_symptom(dengue,               fever).
required_symptom(typhoid,              fever).
required_symptom(tuberculosis,         cough).
required_symptom('chicken pox',        itching).
required_symptom('chicken pox',        blister).
required_symptom(acne,                 pus_filled_pimples).
required_symptom(jaundice,             yellowish_skin).
required_symptom('hepatitis a',        yellowing_of_eyes).
required_symptom('hepatitis b',        yellowing_of_eyes).
required_symptom('hepatitis c',        yellowing_of_eyes).
required_symptom('hepatitis d',        yellowing_of_eyes).
required_symptom('hepatitis e',        yellowing_of_eyes).
required_symptom('alcoholic hepatitis', yellowing_of_eyes).

% Succeeds if every required symptom for Disease is present in ReportedSymptoms.
satisfies_required(Disease, ReportedSymptoms) :-
    \+ (required_symptom(Disease, Required), \+ member(Required, ReportedSymptoms)).


% ─── Exclusion rules ─────────────────────────────────────────────────────────
% If a patient reports a contraindicated symptom, the disease is ruled out.
contraindicated_symptom('common cold',          yellowing_of_eyes).
contraindicated_symptom('common cold',          yellowish_skin).
contraindicated_symptom('common cold',          blood_in_sputum).
contraindicated_symptom(acne,                   yellowing_of_eyes).
contraindicated_symptom(acne,                   yellowish_skin).
contraindicated_symptom(acne,                   blood_in_sputum).
contraindicated_symptom(acne,                   coma).
contraindicated_symptom(migraine,               yellowish_skin).
contraindicated_symptom(migraine,               blood_in_sputum).
contraindicated_symptom(migraine,               pus_filled_pimples).
contraindicated_symptom('varicose veins',       blood_in_sputum).
contraindicated_symptom('varicose veins',       yellowing_of_eyes).
contraindicated_symptom('urinary tract infection', blood_in_sputum).
contraindicated_symptom('urinary tract infection', yellowish_skin).
contraindicated_symptom(psoriasis,              blood_in_sputum).
contraindicated_symptom(psoriasis,              yellowing_of_eyes).
contraindicated_symptom(malaria,                pus_filled_pimples).
contraindicated_symptom(malaria,                blackheads).
contraindicated_symptom(dengue,                 pus_filled_pimples).
contraindicated_symptom(dengue,                 blackheads).
contraindicated_symptom(typhoid,                pus_filled_pimples).
contraindicated_symptom('fungal infection',     blood_in_sputum).
contraindicated_symptom('fungal infection',     yellowing_of_eyes).
contraindicated_symptom(arthritis,              blood_in_sputum).
contraindicated_symptom(arthritis,              yellowing_of_eyes).
contraindicated_symptom(osteoarthristis,        blood_in_sputum).
contraindicated_symptom(osteoarthristis,        yellowing_of_eyes).

% Succeeds if no reported symptom contraindicates Disease.
not_excluded(Disease, ReportedSymptoms) :-
    \+ (contraindicated_symptom(Disease, Symptom), member(Symptom, ReportedSymptoms)).


% ─── Severity classification ─────────────────────────────────────────────────
% Classifies a diagnosis confidence score into an urgency level.
classify_severity(Score, urgent)   :- Score >= 70, !.
classify_severity(Score, moderate) :- Score >= 40, !.
classify_severity(_,     low).


% ─── Scoring ─────────────────────────────────────────────────────────────────
weight_of(Symptom, Weight) :-
    (symptom_weight(Symptom, Weight) -> true ; Weight = 1).

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


% ─── Diagnosis ───────────────────────────────────────────────────────────────
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
