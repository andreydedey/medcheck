:- module(ingest, [
    carregar_dados/0,
    doenca/1,
    sintoma_doenca/2,
    descricao_doenca/2,
    precaucao_doenca/2,
    peso_sintoma/2
]).

:- use_module(library(csv)).
:- use_module(library(lists)).

:- dynamic doenca/1.
:- dynamic sintoma_doenca/2.
:- dynamic descricao_doenca/2.
:- dynamic precaucao_doenca/2.
:- dynamic peso_sintoma/2.

normalizar(Atom, Normal) :-
    atom_string(Atom, Str),
    string_lower(Str, Lower),
    split_string(Lower, "", " ", [Trimmed]),
    atom_string(Normal, Trimmed).

data_path(File, Path) :-
    source_file(ingest:carregar_dados, ThisFile),
    file_directory_name(ThisFile, Dir),
    atomic_list_concat([Dir, '/../data/', File], Path).

carregar_dataset :-
    data_path('dataset.csv', CsvPath),
    csv_read_file(CsvPath, Rows, [functor(row), arity(18)]),
    Rows = [_Header|Data],
    forall(member(Row, Data), processar_linha(Row)).

processar_sintoma(Dc, S) :-
    S \= '',
    normalizar(S, SN),
    SN \= '',
    (sintoma_doenca(Dc, SN) -> true ; assertz(sintoma_doenca(Dc, SN))).
processar_sintoma(_, _) :- true.

processar_linha(Row) :-
    Row =.. [row | [DcRaw|Sintomas]],
    normalizar(DcRaw, Dc),
    Dc \= disease,
    (doenca(Dc) -> true ; assertz(doenca(Dc))),
    maplist(processar_sintoma(Dc), Sintomas).

carregar_descricoes :-
    data_path('symptom_description.csv', CsvPath),
    csv_read_file(CsvPath, Rows, [functor(row), arity(2)]),
    Rows = [_Header|Data],
    forall(member(row(DcRaw, Desc), Data), (
        normalizar(DcRaw, Dc),
        assertz(descricao_doenca(Dc, Desc))
    )).

carregar_precaucoes :-
    data_path('symptom_precaution.csv', CsvPath),
    csv_read_file(CsvPath, Rows, [functor(row), arity(5)]),
    Rows = [_Header|Data],
    forall(member(row(DcRaw, P1, P2, P3, P4), Data), (
        normalizar(DcRaw, Dc),
        include(\=(''), [P1, P2, P3, P4], Ps),
        assertz(precaucao_doenca(Dc, Ps))
    )).

carregar_pesos :-
    data_path('symptom_severity.csv', CsvPath),
    csv_read_file(CsvPath, Rows, [functor(row), arity(2)]),
    Rows = [_Header|Data],
    forall(member(row(SRaw, PesoRaw), Data), (
        normalizar(SRaw, S),
        (number(PesoRaw) -> Peso = PesoRaw ; atom_number(PesoRaw, Peso)),
        assertz(peso_sintoma(S, Peso))
    )).

carregar_dados :-
    write('[ ingest ] carregando dataset...'), nl,
    carregar_dataset,
    carregar_descricoes,
    carregar_precaucoes,
    carregar_pesos,
    aggregate_all(count, doenca(_), NDoencas),
    aggregate_all(count, sintoma_doenca(_, _), NSintomas),
    format('[ ingest ] ~w doenças, ~w relações sintoma-doença carregadas~n', [NDoencas, NSintomas]).
