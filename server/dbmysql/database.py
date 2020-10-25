from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from server.dbmysql.env import environment

username = environment.get('user')
password = environment.get('password')
host = environment.get('host')
port = environment.get('port')
schema = environment.get('schemaName')

cnx = create_engine('mysql+mysqlconnector://' + username + ':' + password + '@' + host + ':' + port + '/' + schema,
                    echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=cnx)

Base = declarative_base()
