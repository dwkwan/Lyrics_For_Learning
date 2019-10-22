#!/usr/bin/python3
"""This module creates the Word class"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from sqlalchemy import *

class Word(BaseModel, Base):

    __tablename__ = 'words'
    text = Column(String(128), nullable=False)
    songs = relationship("Song", secondary='song_word', viewonly=False)
    interpretations = relationship("Interpretation", backref="word")
