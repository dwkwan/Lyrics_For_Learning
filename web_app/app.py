"""This module starts the Lyrics_For_Learning Flask web application and defines endpoints
"""
from flask import Flask
from flask import render_template
from models import storage
from models import Song

app = Flask(__name__)

@app.route('/', strict_slashes=False)
def display_homepage():
    """handles request for homepage"""
    return render_template('homepage.html')

@app.route('/songs/<text>', strict_slashes=False)
def display_song(text):
    """handles request for specific song based on title"""
    songs_dict = storage.all(Song)
    result = songs_dict.get("Song.{:}".format(text))
    if result is not None:
            return render_template('song.html')
    return "NOT FOUND"

@app.route('/suggest', strict_slashes=False)
def display_suggest():
    """handles request for Suggest a Song page"""
    return render_template('suggest.html')

@app.teardown_appcontext
def teardown_db(self):
    """removes the current SQLAlchemy Session"""
    storage.close()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
