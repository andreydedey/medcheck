:- module(serializa, [
    resultado_json/2,
    sintomas_json/2,
    doencas_json/2
]).

:- use_module(ingest).
:- use_module(library(http/json)).

atom_ou_string_para_atom(X, A) :-
    (atom(X) -> A = X ; atom_string(A, X)).

doenca_para_dict(Score-Dc, Dict) :-
    atom_ou_string_para_atom(Dc, DcAtom),
    Confianca is round(Score),
    (descricao_doenca(DcAtom, Desc) -> true ; Desc = ''),
    (precaucao_doenca(DcAtom, Precs) -> true ; Precs = []),
    maplist([P, PA]>>(atom_ou_string_para_atom(P, PA)), Precs, PrecsAtom),
    aggregate_all(set(S), sintoma_doenca(DcAtom, S), Sintomas),
    Dict = doenca{
        nome: DcAtom,
        confianca: Confianca,
        descricao: Desc,
        precaucoes: PrecsAtom,
        sintomas: Sintomas
    }.

resultado_json(Resultados, JSON) :-
    maplist(doenca_para_dict, Resultados, Dicts),
    JSON = json{resultados: Dicts}.

sintomas_json(Sintomas, JSON) :-
    maplist([S, D]>>(
        (peso_sintoma(S, P) -> true ; P = 1),
        D = sintoma{nome: S, peso: P}
    ), Sintomas, Dicts),
    JSON = json{sintomas: Dicts}.

doencas_json(Doencas, JSON) :-
    maplist([D, Dict]>>(
        (descricao_doenca(D, Desc) -> true ; Desc = ''),
        Dict = doenca{nome: D, descricao: Desc}
    ), Doencas, Dicts),
    JSON = json{doencas: Dicts}.
