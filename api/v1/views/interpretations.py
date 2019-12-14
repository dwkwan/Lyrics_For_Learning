#!/usr/bin/python3
"""defines view functions to handle requests for interpretations data"""


from flask import Flask, jsonify, abort, request
from models import storage
from api.v1.views import app_views
from models.song import Song
from models.word import Word
from models.interpretation import Interpretation
from better_profanity import profanity
app = Flask(__name__)


@app_views.route('/interpretations/<word_id>/<song_id>', methods=['GET'],
                 strict_slashes=False)
def get_interpretations(word_id=None, song_id=None):
    """Retrieves all Interpretation objects for a word from a song and returns
    a list containing all of them"""
    word = storage.get('Word', word_id)
    if word is None:
        abort(404)
    song = storage.get('Song', song_id)
    if song is None:
        abort(404)
    interpretations_dict = storage.all(Interpretation)
    interpretations_list = []
    for interpretation in interpretations_dict.values():
        if interpretation.word_id == word_id and interpretation.song_id == song_id:
            interpretations_list.append(interpretation.to_dict())
    return jsonify(interpretations_list), 200


@app_views.route('/interpretations/<word_id>/<song_id>', methods=['POST'],
                 strict_slashes=False)
def post_interpretation(word_id=None, song_id=None):
    """Creates an interpretation for a word from a song"""
    print(word_id)
    print(song_id)
    word = storage.get('Word', word_id)
    if word is None:
        abort(404)
    song = storage.get('Song', song_id)
    if song is None:
        abort(404)
    result = request.get_json()
    if result is None:
        return jsonify({"error": "Not a JSON"}), 400
    if 'text' not in result:
        return jsonify({"error": "Missing text"}), 400
    if profanity.contains_profanity(result["text"]) is True:
        return jsonify({"error": "Profane"}), 400
    interpretation_obj = Interpretation(word_id=word_id, song_id=song_id)
    setattr(interpretation_obj, "text", result["text"])
    storage.new(interpretation_obj)
    storage.save()
    return jsonify(interpretation_obj.to_dict()), 201


@app_views.route('/interpretations/<interpretation_id>', methods=['PUT'],
                 strict_slashes=False)
def put_interpretation(interpretation_id=None):
    """Updates an Interpretation object"""
    interpretation_obj = storage.get('Interpretation', interpretation_id)
    if interpretation_obj is None:
        abort(404)
    result = request.get_json()
    if result is None:
        return jsonify({"error": "Not a JSON"}), 400
    if 'likes' not in result:
        return jsonify({"error": "Missing likes"}), 400
    setattr(interpretation_obj, "likes", result["likes"])
    storage.save()
    return jsonify(interpretation_obj.to_dict()), 200
