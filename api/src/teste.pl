:- use_module(ingest).
:- use_module(diagnostico).
:- use_module(serializa).

:- initialization(main, main).

main :-
    carregar_dados,
    write('=== Teste Diagnostico ==='), nl,
    Sintomas = [itching, skin_rash, nodal_skin_eruptions],
    write('Sintomas informados: '), write(Sintomas), nl,
    diagnosticar(Sintomas, 3, R),
    write('Resultado: '), write(R), nl,
    halt.
