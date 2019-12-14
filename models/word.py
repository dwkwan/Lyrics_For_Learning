#!/usr/bin/python3
"""This module creates the Word class"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from sqlalchemy import *


class Word(BaseModel, Base):
    """A class named Word
    Attributes:
    attr1(text): text of word
    attr2(songs): songs associated with word
    attr3(interpretations): interpretations associated with word
    """
    __tablename__ = 'words'
    text = Column(String(128), nullable=False)
    songs = relationship("Song", secondary='song_word', viewonly=False)
    interpretations = relationship("Interpretation", backref="word")
