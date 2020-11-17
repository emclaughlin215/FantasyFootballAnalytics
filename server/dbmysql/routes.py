from typing import List

from fastapi import FastAPI, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.dbmysql import schemas, models, crud
from server.dbmysql.database import cnx, SessionLocal

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


# ------------ GET PLAYERS AND TEAMS -----------


@app.get("/players/all", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersAll(db: Session = Depends(get_db)):
    return crud.get_all_players(db)


@app.get("/players/latest/all", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersLatestAll(db: Session = Depends(get_db)):
    return crud.get_all_players_latest(db)


@app.get("/players/types", response_model=List[schemas.PlayerType], status_code=status.HTTP_200_OK)
async def playersTypesAll(db: Session = Depends(get_db)):
    return crud.get_all_player_types(db)


@app.get("/players/team/{team_id}", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersTeam(team_id: int, db: Session = Depends(get_db)):
    return crud.get_team_players(db, team_id)


@app.get("/teams/all", response_model=List[schemas.Team], status_code=status.HTTP_200_OK)
async def teamsAll(db: Session = Depends(get_db)):
    return crud.get_all_teams(db)


# ------------- GET STATS ----------------


@app.get("/transfers/topTenIn", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def transfersTopTenIn(db: Session = Depends(get_db)):
    return crud.get_most_transferred_in(db)


@app.get("/transfers/topTenOut", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def transfersTopTenOut(db: Session = Depends(get_db)):
    return crud.get_most_transferred_out(db)


@app.get("/players/topTenSelected", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersTopTenSelected(db: Session = Depends(get_db)):
    return crud.get_most_selected(db)


# ---------- GET TEAMS AND POINTS ----------


@app.get("/expectedPoints/picked", response_model=schemas.TeamExpectedPoints, status_code=status.HTTP_200_OK)
async def expectedPointsPicked(db: Session = Depends(get_db)):
    return crud.get_picked_expected_points(db)


@app.get("/expectedPoints/selected", response_model=schemas.TeamExpectedPoints, status_code=status.HTTP_200_OK)
async def expectedPointsSelected(db: Session = Depends(get_db)):
    return crud.get_selected_expected_points(db)


@app.get("/expectedPoints/highest", response_model=schemas.TeamExpectedPoints, status_code=status.HTTP_200_OK)
async def expectedPointsSelected(db: Session = Depends(get_db)):
    return crud.get_highest_expected_points(db)


# -------- UPDATE PLAYERS AND TEAMS ---------


@app.post("/updatePlayersAndTeams", response_model=str, status_code=status.HTTP_200_OK)
async def expectedPointsHighest():
    return crud.update_players_set_teams()
