:- module(diagnostico, [diagnosticar/3, listar_sintomas/1, listar_doencas/1]).

:- use_module(ingest).
:- use_module(library(lists)).
:- use_module(library(aggregate)).

listar_sintomas(Sintomas) :-
    aggregate_all(set(S), sintoma_doenca(_, S), Sintomas).

listar_doencas(Doencas) :-
    aggregate_all(set(D), doenca(D), Doencas).

sintomas_doenca(Dc, Sintomas) :-
    aggregate_all(set(S), sintoma_doenca(Dc, S), Sintomas).

contar_matches(Dc, SintomasInformados, Matches, Total) :-
    sintomas_doenca(Dc, SintomasDc),
    length(SintomasDc, Total),
    Total > 0,
    include([S]>>(member(S, SintomasDc)), SintomasInformados, Matched),
    length(Matched, Matches).

score_doenca(Dc, SintomasInformados, Score) :-
    contar_matches(Dc, SintomasInformados, Matches, Total),
    Matches > 0,
    Score is (Matches / Total) * 100.

score_ponderado(Dc, SintomasInformados, Score) :-
    sintomas_doenca(Dc, SintomasDc),
    include([S]>>(member(S, SintomasDc)), SintomasInformados, Matched),
    Matched \= [],
    maplist([S, P]>>(peso_sintoma(S, P) -> true ; P = 1), Matched, Pesos),
    maplist([S, P]>>(peso_sintoma(S, P) -> true ; P = 1), SintomasDc, PesosTodos),
    sumlist(Pesos, SomaPesos),
    sumlist(PesosTodos, SomaTotal),
    SomaTotal > 0,
    Score is (SomaPesos / SomaTotal) * 100.

diagnosticar(SintomasInformados, Limite, Resultados) :-
    aggregate_all(set(Dc), doenca(Dc), Doencas),
    findall(
        Score-Dc,
        (member(Dc, Doencas), score_ponderado(Dc, SintomasInformados, Score)),
        Scores
    ),
    msort(Scores, Sorted),
    reverse(Sorted, Desc),
    length(Desc, Total),
    LimiteReal is min(Limite, Total),
    length(Resultados, LimiteReal),
    append(Resultados, _, Desc).
