from flask import Flask, request, jsonify
from flask_cors import CORS
from prolog_engine import listar_sintomas, listar_doencas, diagnosticar

app = Flask(__name__)
CORS(app)


@app.get("/")
def health():
    return jsonify({"status": "ok", "versao": "1.0.0"})


@app.get("/api/sintomas")
def route_sintomas():
    return jsonify({"sintomas": listar_sintomas()})


@app.get("/api/doencas")
def route_doencas():
    return jsonify({"doencas": listar_doencas()})


@app.post("/api/diagnosticar")
def route_diagnosticar():
    body = request.get_json()
    sintomas = body.get("sintomas", [])
    limite = body.get("limite", 5)

    if not sintomas:
        return jsonify({"erro": "sintomas é obrigatório"}), 400

    resultado = diagnosticar(sintomas, limite)
    return jsonify({"resultados": resultado})


if __name__ == "__main__":
    app.run(port=8080, debug=False)
