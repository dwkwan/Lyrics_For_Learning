#!/usr/bin/python3
"""This module creates the Song class"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import *

metadata = Base.metadata

song_word = Table('song_word', metadata,
            Column('song_id', String(60), ForeignKey("songs.id"),
            primary_key=True, nullable=False),
            Column('word_id', String(60), ForeignKey("words.id"), primary_key=True, nullable=False))


class Song(BaseModel, Base):

    __tablename__ = 'songs'
    artist = Column(String(128), nullable=False)
    title = Column(String(128), nullable=False)
    lyrics = Column(String(5000), nullable=False)
    genre = Column(String(128), nullable=False)
    words = relationship("Word", secondary=song_word, viewonly=False)
