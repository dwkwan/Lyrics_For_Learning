#!/usr/bin/python3
"""This module creates the BaseModel class"""

import models
from uuid import uuid4
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class BaseModel():
    """A class named BaseModel
    Attributes:
    attr1(id): object id
    attr2(created_at): datetime instance is created
    attr3(updated_at): datetime instance is created and updated when changed
    """
    id = Column(String(60), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    def __init__(self, *args, **kwargs):
        """Initiliazes an instance of BaseModel"""
        if kwargs:
            for key, value in kwargs.items():
                if key != "__class__":
                    setattr(self, key, value)
        self.id = str(uuid4())
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def __str__(self):
        """Returns string representation of BaseModel instance"""
        return "[{}] ({}) {}".format(self.__class__.__name__,
                                     self.id, self.__dict__)

    def to_dict(self):
        """returns a dictionary containing all keys/values of __dict__"""
        newdict = self.__dict__.copy()
        newdict['created_at'] = datetime.isoformat(newdict['created_at'])
        newdict['updated_at'] = datetime.isoformat(newdict['updated_at'])
        newdict['__class__'] = self.__class__.__name__
        if newdict.get('_sa_instance_state'):
            del newdict['_sa_instance_state']
        return newdict

    def save(self):
        """updates public instance attr updated_at with current datetime"""
        self.updated_at = datetime.now()
        models.storage.save()
