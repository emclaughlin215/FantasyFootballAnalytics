from sqlalchemy import Column, String, Boolean, Integer, DateTime

from database import Base


class PlayerType(Base):
    __tablename__ = "element_types"

    index = Column(Integer, primary_key=True, nullable=True)
    id = Column(Integer, nullable=True)
    plural_name = Column(String, nullable=True)
    plural_name_short = Column(String, nullable=True)
    singular_name = Column(String, nullable=True)
    singular_name_short = Column(String, nullable=True)
    squad_select = Column(Integer, nullable=True)
    squad_min_play = Column(Integer, nullable=True)
    squad_max_play = Column(Integer, nullable=True)
    ui_shirt_specific = Column(Boolean, nullable=True)
    element_count = Column(Integer, nullable=True)
    timestamp = Column(String, nullable=True)


class Player(Base):
    __tablename__ = "elements"

    id = Column(Integer, primary_key=True, index=True)
    chance_of_playing_this_round = Column(Integer, nullable=True)
    chance_of_playing_next_round = Column(Integer, nullable=True)
    code = Column(Integer, nullable=True)
    cost_change_event = Column(Integer, nullable=True)
    cost_change_event_fall = Column(Integer, nullable=True)
    cost_change_start = Column(Integer, nullable=True)
    cost_change_start_fall = Column(Integer, nullable=True)
    dreamteam_count = Column(Integer, nullable=True)
    element_type = Column(Integer, nullable=True)
    ep_next = Column(Integer, nullable=True)
    ep_this = Column(Integer, nullable=True)
    event_points = Column(Integer, nullable=True)
    first_name = Column(String, nullable=True)
    form = Column(Integer, nullable=True)
    in_dreamteam = Column(Boolean, nullable=True)
    news = Column(String, nullable=True)
    news_added = Column(String, nullable=True)
    now_cost = Column(Integer, nullable=True)
    photo = Column(String, nullable=True)
    points_per_game = Column(Integer, nullable=True)
    second_name = Column(String, nullable=True)
    selected_by_percent = Column(Integer, nullable=True)
    special = Column(Boolean, nullable=True)
    squad_number = Column(Integer, nullable=True)
    status = Column(String, nullable=True)
    team = Column(Integer, nullable=True)
    team_code = Column(Integer, nullable=True)
    total_points = Column(Integer, nullable=True)
    transfers_in = Column(Integer, nullable=True)
    transfers_in_event = Column(Integer, nullable=True)
    transfers_out = Column(Integer, nullable=True)
    transfers_out_event = Column(Integer, nullable=True)
    value_form = Column(Integer, nullable=True)
    value_season = Column(Integer, nullable=True)
    web_name = Column(String, nullable=True)
    minutes = Column(Integer, nullable=True)
    goals_scored = Column(Integer, nullable=True)
    assists = Column(Integer, nullable=True)
    clean_sheets = Column(Integer, nullable=True)
    goals_conceded = Column(Integer, nullable=True)
    own_goals = Column(Integer, nullable=True)
    penalties_saved = Column(Integer, nullable=True)
    penalties_missed = Column(Integer, nullable=True)
    yellow_cards = Column(Integer, nullable=True)
    red_cards = Column(Integer, nullable=True)
    saves = Column(Integer, nullable=True)
    bonus = Column(Integer, nullable=True)
    bps = Column(Integer, nullable=True)
    influence = Column(Integer, nullable=True)
    creativity = Column(Integer, nullable=True)
    threat = Column(Integer, nullable=True)
    ict_index = Column(Integer, nullable=True)
    influence_rank = Column(Integer, nullable=True)
    influence_rank_type = Column(Integer, nullable=True)
    creativity_rank = Column(Integer, nullable=True)
    creativity_rank_type = Column(Integer, nullable=True)
    threat_rank = Column(Integer, nullable=True)
    threat_rank_type = Column(Integer, nullable=True)
    ict_index_rank = Column(Integer, nullable=True)
    ict_index_rank_type = Column(Integer, nullable=True)
    form_to_cost = Column(Integer, nullable=True)
    bonus_to_cost = Column(Integer, nullable=True)

    
class Team(Base):
    __tablename__ = "teams"

    code = Column(Integer, primary_key=True)
    draw = Column(Integer)
    form = Column(Integer, nullable=True)
    id = Column(Integer)
    loss = Column(Integer)
    name = Column(String)
    played = Column(Integer)
    points = Column(Integer)
    position = Column(Integer)
    short_name = Column(String)
    strength = Column(Integer, nullable=True)
    team_division = Column(String, nullable=True)
    unavailable = Column(Boolean)
    win = Column(Integer)
    strength_overall_home = Column(Integer)
    strength_overall_away = Column(Integer)
    strength_attack_home = Column(Integer)
    strength_attack_away = Column(Integer)
    strength_defence_home = Column(Integer)
    strength_defence_away = Column(Integer)
    pulse_id = Column(Integer)

