from datetime import date
from typing import Optional

from datetime import datetime
from pydantic import BaseModel


class PlayerTypeBase(BaseModel):
    id: int


class PlayerType(PlayerTypeBase):
    index: Optional[int]
    plural_name: Optional[str]
    plural_name_short: Optional[str]
    singular_name: Optional[str]
    singular_name_short: Optional[str]
    squad_select: Optional[int]
    squad_min_play: Optional[int]
    squad_max_play: Optional[int]
    ui_shirt_specific: Optional[bool]
    element_count: Optional[int]
    timestamp: Optional[datetime]

    class Config:
        orm_mode = True


class PlayerBase(BaseModel):
    id: int


class Player(PlayerBase):
    primary_key: Optional[str]
    first_name: Optional[str]
    second_name: Optional[str]
    chance_of_playing_this_round: Optional[float]
    chance_of_playing_next_round: Optional[float]
    code: Optional[int]
    cost_change_event: Optional[int]
    cost_change_event_fall: Optional[int]
    cost_change_start: Optional[int]
    cost_change_start_fall: Optional[int]
    dreamteam_count: Optional[int]
    element_type: Optional[int]
    element_type_singular_name: Optional[str]
    element_type_singular_name_short: Optional[str]
    ep_next: Optional[float]
    ep_this: Optional[float]
    event_points: Optional[int]
    form: Optional[float]
    in_dreamteam: Optional[bool]
    news: Optional[str]
    news_added: Optional[str]
    now_cost: Optional[int]
    cost: Optional[float]
    photo: Optional[str]
    points_per_game: Optional[float]
    selected_by_percent: Optional[float]
    special: Optional[bool]
    squad_number: Optional[int]
    status: Optional[str]
    team: Optional[int]
    team_code: Optional[int]
    total_points: Optional[int]
    transfers_in: Optional[int]
    transfers_in_event: Optional[int]
    transfers_out: Optional[int]
    transfers_out_event: Optional[int]
    value_form: Optional[float]
    value_season: Optional[float]
    web_name: Optional[str]
    minutes: Optional[int]
    goals_scored: Optional[int]
    assists: Optional[int]
    clean_sheets: Optional[int]
    goals_conceded: Optional[int]
    own_goals: Optional[int]
    penalties_saved: Optional[int]
    penalties_missed: Optional[int]
    yellow_cards: Optional[int]
    red_cards: Optional[int]
    saves: Optional[int]
    bonus: Optional[int]
    bps: Optional[int]
    influence: Optional[float]
    creativity: Optional[float]
    threat: Optional[float]
    ict_index: Optional[float]
    influence_rank: Optional[int]
    influence_rank_type: Optional[int]
    creativity_rank: Optional[int]
    creativity_rank_type: Optional[int]
    threat_rank: Optional[int]
    threat_rank_type: Optional[int]
    ict_index_rank: Optional[int]
    ict_index_rank_type: Optional[int]
    corners_and_indirect_freekicks_order: Optional[int]
    corners_and_indirect_freekicks_text: Optional[str]
    direct_freekicks_order: Optional[int]
    direct_freekicks_text: Optional[str]
    penalties_order: Optional[int]
    penalties_text: Optional[str]
    form_to_cost: Optional[float]
    bonus_to_cost: Optional[float]
    timestamp: Optional[datetime]

    class Config:
        orm_mode = True


class PickedTeamBase(BaseModel):
    primary_key = str


class PickedTeam(PickedTeamBase):
    element: Optional[int]
    event: Optional[int]
    position: Optional[int]
    multiplier: Optional[int]
    is_captain: Optional[bool]
    is_vice_captain: Optional[bool]
    first_name: Optional[str]
    second_name: Optional[str]
    element_name: Optional[str]
    cost: Optional[float]
    gameweek_points: Optional[int]

    class Config:
        orm_mode = True


class TeamBase(BaseModel):
    id: int
    code: int


class Team(TeamBase):
    draw: Optional[int]
    form: Optional[int]
    loss: Optional[int]
    name: Optional[str]
    played: Optional[int]
    points: Optional[int]
    position: Optional[int]
    short_name: Optional[str]
    strength: Optional[int]
    team_division: Optional[str]
    unavailable: Optional[bool]
    win: Optional[int]
    strength_overall_home: Optional[int]
    strength_overall_away: Optional[int]
    strength_attack_home: Optional[int]
    strength_attack_away: Optional[int]
    strength_defence_home: Optional[int]
    strength_defence_away: Optional[int]
    pulse_id: Optional[int]

    class Config:
        orm_mode = True
