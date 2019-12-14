#!/usr/bin/python3
"""This file creates an instance of Storage. It also imports the definitions of
the BaseModel and Song classes"""
from models.base_model import BaseModel
from models.song import Song
from models.word import Word
from models.engine.storage import Storage

storage = Storage()
storage.reload()
