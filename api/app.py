from flask import Flask, request, jsonify
from flask_cors import CORS
from prolog_engine import get_symptoms, get_diseases, diagnose

app = Flask(__name__)
CORS(app)


@app.get("/")
def health():
    return jsonify({"status": "ok", "version": "1.0.0"})


@app.get("/api/symptoms")
def route_symptoms():
    return jsonify({"symptoms": get_symptoms()})


@app.get("/api/diseases")
def route_diseases():
    return jsonify({"diseases": get_diseases()})


@app.post("/api/diagnose")
def route_diagnose():
    body = request.get_json()
    symptoms = body.get("symptoms", [])
    limit = body.get("limit", 5)

    if not symptoms:
        return jsonify({"error": "symptoms is required"}), 400

    results = diagnose(symptoms, limit)
    return jsonify({"results": results})


if __name__ == "__main__":
    app.run(port=8080, debug=False)
