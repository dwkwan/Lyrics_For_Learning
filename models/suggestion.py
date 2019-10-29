#!/usr/bin/python3
"""This module creates the Suggestion class"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy import *

class Suggestion(BaseModel, Base):

    __tablename__ = 'suggestions'
    suggested_artist = Column(String(120), nullable=False)
    suggested_song  = Column(String(120), nullable=False)
    suggested_words = Column(String(300), nullable=False)
    name = Column(String(120), nullable=False)
    email = Column(String(120), nullable=False)
