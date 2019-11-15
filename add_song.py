#!/usr/bin/python3
"""Script for testing the addition of songs to the site"""
import models, requests
from models.base_model import BaseModel
from models.song import Song
from models.word import Word
from models import storage

input_artist = input('Artist: ')
input_song = input('Song: ')
db_songs = {}
for song in storage.all(Song).values():
    db_songs[song.title] = song
if db_songs.get(input_song) is None:
    input_genre = input('Genre: ')
    image = input('image_url: ')
    lyrics = input('lyrics: ')
    song = Song()
    song.artist = input_artist
    song.title = input_song
    song.lyrics = lyrics
    song.genre = input_genre
    song.image_url = image
else:
    song = db_songs[input_song]
words = input('words: ')
word_list = map(str, words.strip('[]').split(','))
db_words = {}
for word in storage.all(Word).values():
    db_words[word.text] = word
for item in word_list:
    if db_words.get(item) is None:
        word = Word()
        word.text = item
        word.save()
        song.words.append(word)
    else:
        song.words.append(db_words[item])
models.storage.new(song)
song.save()
