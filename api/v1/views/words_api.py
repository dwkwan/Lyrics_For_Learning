#!/usr/bin/python3
"""defines view functions to handle requests for songs data"""


from flask import Flask, jsonify, abort, request
from api.v1.views import app_views
import requests
import os
app = Flask(__name__)


@app_views.route('/words_api/<text>', methods=['GET'], strict_slashes=False)
def get_word_api_data(text):
    """Retrieves data for word from external API and returns response to
    client-side"""
    headers = {
              'x-rapidapi-host': os.getenv('WORDS_API_HOST'),
              'x-rapidapi-key': os.getenv('WORDS_API_KEY')
            }
    r = requests.get('https://wordsapiv1.p.rapidapi.com/words/{:}'.format(
        text), headers=headers, allow_redirects=False).json()
    r['word'] = text
    return(jsonify(r))
    abort(404)
