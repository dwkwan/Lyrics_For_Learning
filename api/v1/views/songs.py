#!/usr/bin/python3
"""defines view functions to handle requests for songs data"""


from flask import Flask, jsonify, abort, request
from models import storage
from api.v1.views import app_views
from models.song import Song
app = Flask(__name__)


@app_views.route('/songs', methods=['GET'], strict_slashes=False)
def get_songs():
    """Retrieves all Song objects from database and returns a list containing
    all of them"""
    songs_dict = storage.all(Song)
    songs_list = []
    for song in songs_dict.values():
        songs_list.append(song.to_dict())
    return jsonify(songs_list), 200

@app_views.route('/songs/<text>', methods=['GET'], strict_slashes=False)
def get_song(text):
    """Retrieves Song object from database and returns a dictionary"""
    songs_dict = storage.all(Song)
    return jsonify(songs_dict.get("Song.{:}".format(text)).to_dict()), 200

@app_views.route('/songs/genre/<genre>', methods=['GET'], strict_slashes=False)
def get_songs_by_genre(genre):
    """Retrieves all Song objects from database with a specified genre"""
    songs_dict = storage.all(Song)
    songs_list = []
    for song in songs_dict.values():
        if song.genre == genre:
            songs_list.append(song.to_dict())
    return jsonify(songs_list), 200
