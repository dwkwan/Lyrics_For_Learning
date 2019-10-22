#!/usr/bin/python3
"""This module creates the User_Content class"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, Integer
from sqlalchemy.orm import relationship
from sqlalchemy import *

class Interpretation(BaseModel, Base):

    __tablename__ = 'interpretations'
    text = Column(String(600), nullable=False)
    song_id = Column(String(60), ForeignKey('songs.id'), nullable=False)
    word_id = Column(String(60), ForeignKey('words.id'), nullable=False)
    likes = Column(Integer, default=0, nullable=False)
