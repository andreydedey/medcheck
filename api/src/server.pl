:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_cors)).

:- use_module(ingest).
:- use_module(diagnostico).
:- use_module(serializa).

:- set_setting(http:cors, [*]).

:- http_handler('/api/sintomas',    handle_sintomas,    []).
:- http_handler('/api/doencas',     handle_doencas,     []).
:- http_handler('/api/diagnosticar', handle_diagnosticar, [method(post)]).
:- http_handler('/',                handle_health,      []).

handle_health(Request) :-
    cors_enable(Request, [methods([get])]),
    reply_json_dict(json{status: ok, versao: '1.0.0'}).

handle_sintomas(Request) :-
    cors_enable(Request, [methods([get])]),
    listar_sintomas(Sintomas),
    sintomas_json(Sintomas, JSON),
    reply_json_dict(JSON).

handle_doencas(Request) :-
    cors_enable(Request, [methods([get])]),
    listar_doencas(Doencas),
    doencas_json(Doencas, JSON),
    reply_json_dict(JSON).

handle_diagnosticar(Request) :-
    cors_enable(Request, [methods([post, options])]),
    (   memberchk(method(options), Request)
    ->  reply_json_dict(json{})
    ;   http_read_json_dict(Request, Body, [value_string_as(atom)]),
        get_dict(sintomas, Body, SintomasRaw),
        maplist([S, A]>>(atom_string(A, S)), SintomasRaw, Sintomas),
        (get_dict(limite, Body, Limite) -> true ; Limite = 5),
        diagnosticar(Sintomas, Limite, Resultados),
        resultado_json(Resultados, JSON),
        reply_json_dict(JSON)
    ).

iniciar(Porta) :-
    carregar_dados,
    format('[ server ] iniciando na porta ~w~n', [Porta]),
    http_server(http_dispatch, [port(Porta)]),
    thread_get_message(quit).

:- initialization(main, main).

main :-
    (getenv('PORT', PortaStr) -> atom_number(PortaStr, Porta) ; Porta = 8080),
    iniciar(Porta).
