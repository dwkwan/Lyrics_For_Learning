#!/usr/bin/python3
"""This module defines the Storage class"""
from models.base_model import BaseModel, Base
from models.song import Song
from sqlalchemy import (create_engine)
from sqlalchemy.orm import scoped_session
from sqlalchemy.orm import sessionmaker
import os

class Storage:
    """This class manages the MySQL database for Lyrics for Learning"""
    __engine = None
    __session = None

    def __init__(self):
        self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.format(
            os.getenv("LYRICS_MYSQL_USER"), os.getenv("LYRICS_MYSQL_PWD"),
            os.getenv("LYRICS_MYSQL_HOST"), os.getenv("LYRICS_MYSQL_DB"),
            pool_pre_ping=True))

    def all(self, cls=None):
        """returns a dictionary
        Return:
            returns a dictionary of objects
        """
        obj_dict = {}
        if cls is None:
            for obj in self.__session.query(Song).all():
                key = "{}.{}".format(type(obj).__name__, obj.id)
                obj_dict[key] = obj
        else:
            for obj in self.__session.query(cls).all():
                key = "{}.{}".format(cls.__name__, obj.id)
                obj_dict[key] = obj
        return obj_dict

    def new(self, obj):
        """add the object to the current database session
        Args:
            obj: given object
        """
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current database session
        """
        self.__session.commit()

    def delete(self, obj=None):
        """delete the object from the current database session
        Args:
            obj: given object
        """
        if obj is not None:
            self.__session.delete(obj)

    def reload(self):
        """create all tables in the database and the current database session
        """
        Base.metadata.create_all(self.__engine)
        session_factory = sessionmaker(bind=self.__engine,
                                       expire_on_commit=False)
        Session = scoped_session(session_factory)
        self.__session = Session()

    def close(self):
        """closes the current session to force reload
        """
        self.__session.close()
