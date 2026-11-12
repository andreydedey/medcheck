% ─── Disease categories ───────────────────────────────────────────────────────
% Maps each disease to a broad medical category.

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


% ─── Specialist per category ──────────────────────────────────────────────────
% Maps each category to the appropriate medical specialist.

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


% ─── Mandatory symptoms ───────────────────────────────────────────────────────
% A disease is only scored if ALL of its required symptoms are reported.

required_symptom(malaria,               chills).
required_symptom(malaria,               fever).
required_symptom(dengue,                fever).
required_symptom(typhoid,               fever).
required_symptom(tuberculosis,          cough).
required_symptom('chicken pox',         itching).
required_symptom('chicken pox',         blister).
required_symptom(acne,                  pus_filled_pimples).
required_symptom(jaundice,              yellowish_skin).
required_symptom('hepatitis a',         yellowing_of_eyes).
required_symptom('hepatitis b',         yellowing_of_eyes).
required_symptom('hepatitis c',         yellowing_of_eyes).
required_symptom('hepatitis d',         yellowing_of_eyes).
required_symptom('hepatitis e',         yellowing_of_eyes).
required_symptom('alcoholic hepatitis', yellowing_of_eyes).


% ─── Exclusion rules ──────────────────────────────────────────────────────────
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
