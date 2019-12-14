#!/usr/bin/python3
"""This module creates the Suggestion class"""

import models
from models.base_model import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy import *


class Suggestion(BaseModel, Base):
     """A class named Suggestion
     Attributes:
     attr1(suggested_artist): artist the user suggested
     attr2(suggested_song): song the user suggested
     attr3(suggested_words): words associated with song that the user suggested
     attr4(name): name of user that submitted suggestion
     attr5(email): email of user that submitted suggestion
     """
     __tablename__ = 'suggestions'
     suggested_artist = Column(String(120), nullable=False)
     suggested_song = Column(String(120), nullable=False)
     suggested_words = Column(String(300), nullable=False)
     name = Column(String(120), nullable=False)
     email = Column(String(120), nullable=False)
