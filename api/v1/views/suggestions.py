#!/usr/bin/python3
"""defines view functions to handle requests for interpretations data"""


from flask import Flask, jsonify, abort, request
from models import storage
from api.v1.views import app_views
from models.suggestion import Suggestion
app = Flask(__name__)


@app_views.route('/suggestions/', methods=['GET'], strict_slashes=False)
def get_suggestions(word_id=None, song_id=None):
    """Retrieves all Suggestion objects from database and returns a list containing
    all of them"""
    suggestions_dict = storage.all(Suggestion)
    suggestions_list = []
    for suggestion in suggestions_dict.values():
            suggestions_list.append(suggestion.to_dict())
    return jsonify(suggestions_list), 200


@app_views.route('/suggestions/', methods=['POST'], strict_slashes=False)
def post_suggestion():
    """Creates a Suggestion object"""
    result = request.get_json()
    if result is None:
        return jsonify({"error": "Not a JSON"}), 400
    if result['suggested_artist'] == "":
        return jsonify({"error": "Missing suggested_artist"}), 400
    if result['suggested_song'] == "":
        return jsonify({"error": "Missing suggested_song"}), 400
    if result['suggested_words'] == "":
        return jsonify({"error": "Missing suggested_words"}), 400
    if result['email'] == "":
        return jsonify({"error": "Missing email"}), 400
    if result['name'] == "":
        return jsonify({"error": "Missing name"}), 400
    suggestion_obj = Suggestion()
    setattr(suggestion_obj, "suggested_artist", result["suggested_artist"])
    setattr(suggestion_obj, "suggested_song", result["suggested_song"])
    setattr(suggestion_obj, "suggested_words", result["suggested_words"])
    setattr(suggestion_obj, "email", result["email"])
    setattr(suggestion_obj, "name", result["name"])
    storage.new(suggestion_obj)
    storage.save()
    return jsonify(suggestion_obj.to_dict()), 201
