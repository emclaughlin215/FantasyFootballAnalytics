import json
from typing import List

from fastapi import FastAPI, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.api import schemas, models, crud
from server.api.database import cnx, SessionLocal

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


@app.get("/players/all/{player_id}", response_model=List[schemas.Player], status_code=status.HTTP_200_OK)
async def playersAll(player_id: int, db: Session = Depends(get_db)):
    return crud.get_all_player(db, player_id)


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


# --------------- GET METADATA -------------


@app.get("/metadata", response_model=schemas.Metadata, status_code=status.HTTP_200_OK)
async def getMetadata():
    return crud.get_metdata()


# ---------- GET TEAMS AND POINTS ----------


@app.get("/expectedPoints/picked", response_model=schemas.TeamExpectedPoints, status_code=status.HTTP_200_OK)
async def expectedPointsPicked(db: Session = Depends(get_db)):
    return crud.get_picked_expected_points(db)


@app.get("/expectedPoints/selected", response_model=schemas.TeamExpectedPoints, status_code=status.HTTP_200_OK)
async def expectedPointsSelected(db: Session = Depends(get_db)):
    return crud.get_selected_expected_points(db)


@app.get("/expectedPoints/highest/{period_qualifier}", response_model=schemas.TeamExpectedPoints, status_code=status.HTTP_200_OK)
async def expectedPointsSelected(period_qualifier: str, db: Session = Depends(get_db)):
    return crud.get_highest_expected_points(db, period_qualifier)


# -------- UPDATE PLAYERS AND TEAMS ---------

@app.put("/update/PlayersAndTeams", response_model=str, status_code=status.HTTP_200_OK)
async def expectedPointsHighest():
    return crud.update_players_set_teams()


# --------- SUBMIT TEAMS AND TRANSFERS -----------

@app.post("/set/teams", response_model=str, status_code=status.HTTP_200_OK)
async def submitSelectedTeam(submitTeamTeam: schemas.SubmitTeam):
    return crud.submit_team(submitTeamTeam)


@app.post("/set/transfers", response_model=str, status_code=status.HTTP_200_OK)
async def submitTransfers(submitTransfers: schemas.SubmitTransfers):
    return crud.submit_transfers(submitTransfers)

# ---------- EVENTS AND GAMEWEEK ------------

@app.get("/gameweek/", response_model=schemas.EventInfo, status_code=status.HTTP_200_OK)
async def getGameWeek(db: Session = Depends(get_db)):
    return crud.get_game_week_info(db)


@app.put('/update/events', response_model=str, status_code=status.HTTP_200_OK)
async def updateEvents():
    return crud.update_events()


# ---------------- FIXTURES -------------------

@app.get("/fixtures/{team_id}/{gameweek}", response_model=List[schemas.TeamFixture], status_code=status.HTTP_200_OK)
async def getPlayerFixtures(team_id: int, gameweek: int, db: Session = Depends(get_db)):
    return crud.get_player_fixtures(db, team_id, gameweek)


# --------------- TRANSFERS -------------------

@app.get("/transfers/suggested", response_model=List[schemas.Change], status_code=status.HTTP_200_OK)
async def getSuggestedTransfers(db: Session = Depends(get_db)):
    return crud.get_suggested_transfers(db)
