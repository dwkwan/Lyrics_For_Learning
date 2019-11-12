#!/usr/bin/python3
"""defines view functions to handle requests for song_word data"""


from flask import Flask, jsonify, abort, request
from models import storage
from api.v1.views import app_views
from models.song import Song
app = Flask(__name__)


@app_views.route('/songs/<song_id>/words', methods=['GET'], strict_slashes=False)
def get_words_for_song(song_id):
    """Retrieves all words from a song and returns a list containing
    all of them"""
    song = storage.get("Song", song_id)
    if song is None:
        return jsonify({}), 404
    word_list = []
    for word in song.words:
        word_list.append(word.to_dict())
    return jsonify(word_list), 200
