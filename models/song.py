#!/usr/bin/python3
"""This module creates the Song class"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String

class Song(BaseModel, Base):

    __tablename__ = 'song'
    artist = Column(String(128), nullable=False)
    title = Column(String(128), nullable=False)
    lyrics = Column(String(5000), nullable=False)
