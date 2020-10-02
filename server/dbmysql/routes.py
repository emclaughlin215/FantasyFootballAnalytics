from fastapi import FastAPI, status, Depends
from typing import List

from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import crud
import models
import schemas
from database import cnx, SessionLocal

models.Base.metadata.create_all(bind=cnx)
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/players/all", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersAll(db: Session = Depends(get_db)):
    return crud.get_all_players(db)


@app.get("/players/player/{player_code}", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersAll(player_code, db: Session = Depends(get_db)):
    return crud.get_player(db, player_code)


@app.get("/players/latest/all", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersLatestAll(db: Session = Depends(get_db)):
    return crud.get_all_players_latest(db)


@app.get("/players/latest/player/{player_code}", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def player(player_code, db: Session = Depends(get_db)):
    return crud.get_player_latest(db, player_code)


@app.get("/players/types", response_model=List[schemas.PlayerType], status_code=status.HTTP_200_OK)
async def playersTypesAll(db: Session = Depends(get_db)):
    return crud.get_all_player_types(db)


@app.get("/players/team/{team_id}", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersTeam(team_id: int, db: Session = Depends(get_db)):
    return crud.get_team_players(db, team_id)


@app.get("/teams/all", response_model=List[schemas.Team], status_code=status.HTTP_200_OK)
async def teamsAll(db: Session = Depends(get_db)):
    return crud.get_all_teams(db)


@app.get("/transfers/topTenIn", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def transfersTopTenIn(db: Session = Depends(get_db)):
    return crud.get_most_transferred_in(db)


@app.get("/transfers/topTenOut", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def transfersTopTenOut(db: Session = Depends(get_db)):
    return crud.get_most_transferred_out(db)


@app.get("/players/topTenSelected", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersTopTenSelected(db: Session = Depends(get_db)):
    return crud.get_most_selected(db)
