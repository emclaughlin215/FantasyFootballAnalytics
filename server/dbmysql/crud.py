from sqlalchemy import select, Table, func, desc
from sqlalchemy.orm import Session

import models


def get_all_players(db: Session):
    return db.query(models.Player).all()


def get_all_players_latest(db: Session):
    return db.query(models.PlayerLatest).all()


def get_player(db: Session, player_code: int):
    return db.query(models.Player).filter(models.Player.code == player_code).all()


def get_player_latest(db: Session, player_code: int):
    return db.query(models.PlayerLatest).filter(models.PlayerLatest.code == player_code).all()


def get_all_player_types(db: Session):
    return db.query(models.PlayerType).all()


def get_team_players(db: Session, team_id: int):
    return db.query(models.Player).filter(models.Player.team == team_id).all()


def get_all_teams(db: Session):
    return db.query(models.Team).all()
