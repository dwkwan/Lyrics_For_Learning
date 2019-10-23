#!/usr/bin/python3
"""defines view functions to handle requests for songs data"""


from flask import Flask, jsonify, abort, request
from models import storage
from api.v1.views import app_views
from models.word import Word
app = Flask(__name__)


@app_views.route('/words/<text>', methods=['GET'], strict_slashes=False)
def get_word_id(text):
    """Retrieves word_id based on word"""
    words_dict = storage.all(Word)
    for word in words_dict.values():
        if word.text == text:
            return jsonify(word.id), 200
    abort(404)
