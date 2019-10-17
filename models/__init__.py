#!/usr/bin/python3
"""This file creates an instance of FileStorage. It also imports definition of the BaseModel and Song classes"""
from models.base_model import BaseModel
from models.song import Song
from models.engine.storage import Storage

storage = Storage()
storage.reload()
