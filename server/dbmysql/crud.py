from sqlalchemy.orm import Session

import models


def get_all_players(db: Session):
    return db.query(models.Player).all()


def get_all_player_types(db: Session):
    return db.query(models.PlayerType).all()


def get_team_players(db: Session, team_id: int):
    return db.query(models.Player).filter(models.Player.team == team_id).all()


def get_all_teams(db: Session):
    return db.query(models.Team).all()
