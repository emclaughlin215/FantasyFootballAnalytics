from sqlalchemy import Column, String, Boolean, Integer, DateTime, Float, ARRAY


from server.api.database import Base


class Timestamp_Column(object):
    timestamp = Column(DateTime, nullable=True)


class Events(Base):
    __tablename__ = 'events'

    index = Column(Integer, primary_key=True, nullable=True)
    id = Column(Integer, nullable=False)
    name = Column(String(50), nullable=True)
    deadline_time = Column(String(50), nullable=True)
    average_entry_score = Column(Integer, nullable=True)
    finished = Column(Boolean, nullable=True)
    data_checked = Column(Boolean, nullable=True)
    highest_scoring_entry = Column(Integer, nullable=True)
    deadline_time_epoch = Column(Integer, nullable=True)
    deadline_time_game_offset = Column(Integer, nullable=True)
    highest_score = Column(Integer, nullable=True)
    is_previous = Column(Boolean, nullable=True)
    is_current = Column(Boolean, nullable=True)
    is_next = Column(Boolean, nullable=True)
    most_selected = Column(Integer, nullable=True)
    most_transferred_in = Column(Integer, nullable=True)
    top_element = Column(Integer, nullable=True)
    transfers_made = Column(Integer, nullable=True)
    most_captained = Column(Integer, nullable=True)
    most_vice_captained = Column(Integer, nullable=True)


class PlayerType(Timestamp_Column, Base):
    __tablename__ = "element_types"

    index = Column(Integer, primary_key=True, nullable=True)
    id = Column(Integer, nullable=True)
    plural_name = Column(String(50), nullable=True)
    plural_name_short = Column(String(50), nullable=True)
    singular_name = Column(String(50), nullable=True)
    singular_name_short = Column(String(50), nullable=True)
    squad_select = Column(Integer, nullable=True)
    squad_min_play = Column(Integer, nullable=True)
    squad_max_play = Column(Integer, nullable=True)
    ui_shirt_specific = Column(Boolean, nullable=True)
    element_count = Column(Integer, nullable=True)


class Player_Columns(Timestamp_Column):

    primary_key = Column(String(50), primary_key=True, nullable=False)
    id = Column(Integer, index=True)
    chance_of_playing_this_round = Column(Float, nullable=True)
    chance_of_playing_next_round = Column(Float, nullable=True)
    code = Column(Integer, nullable=True)
    cost_change_event = Column(Float, nullable=True)
    cost_change_event_fall = Column(Float, nullable=True)
    cost_change_start = Column(Float, nullable=True)
    cost_change_start_fall = Column(Float, nullable=True)
    dreamteam_count = Column(Integer, nullable=True)
    element_type = Column(Integer, nullable=True)
    element_name = Column(String(50), nullable=True)
    element_name_short = Column(String(50), nullable=True)
    ep_next = Column(Float, nullable=True)
    ep_this = Column(Float, nullable=True)
    event_points = Column(Integer, nullable=True)
    event = Column(Integer, nullable=True)
    first_name = Column(String(50), nullable=True)
    form = Column(Float, nullable=True)
    in_dreamteam = Column(Boolean, nullable=True)
    news = Column(String(50), nullable=True)
    news_added = Column(String(50), nullable=True)
    now_cost = Column(Float, nullable=True)
    cost = Column(Integer, nullable=True)
    photo = Column(String(50), nullable=True)
    points_per_game = Column(Float, nullable=True)
    second_name = Column(String(50), nullable=True)
    selected_by_percent = Column(Float, nullable=True)
    special = Column(Boolean, nullable=True)
    squad_number = Column(Integer, nullable=True)
    status = Column(String(50), nullable=True)
    team = Column(Integer, nullable=True)
    team_code = Column(Integer, nullable=True)
    total_points = Column(Integer, nullable=True)
    transfers_in = Column(Integer, nullable=True)
    transfers_in_event = Column(Integer, nullable=True)
    transfers_out = Column(Integer, nullable=True)
    transfers_out_event = Column(Integer, nullable=True)
    value_form = Column(Float, nullable=True)
    value_season = Column(Float, nullable=True)
    web_name = Column(String(50), nullable=True)
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
    influence = Column(Float, nullable=True)
    creativity = Column(Float, nullable=True)
    threat = Column(Float, nullable=True)
    ict_index = Column(Float, nullable=True)
    influence_rank = Column(Integer, nullable=True)
    influence_rank_type = Column(Integer, nullable=True)
    creativity_rank = Column(Integer, nullable=True)
    creativity_rank_type = Column(Integer, nullable=True)
    threat_rank = Column(Integer, nullable=True)
    threat_rank_type = Column(Integer, nullable=True)
    ict_index_rank = Column(Integer, nullable=True)
    ict_index_rank_type = Column(Integer, nullable=True)
    corners_and_indirect_freekicks_order = Column(Integer, nullable=True)
    corners_and_indirect_freekicks_text = Column(String(50), nullable=True)
    direct_freekicks_order = Column(Integer, nullable=True)
    direct_freekicks_text = Column(String(50), nullable=True)
    penalties_order = Column(Integer, nullable=True)
    penalties_text = Column(String(50), nullable=True)
    form_to_cost = Column(Float, nullable=True)
    bonus_to_cost = Column(Float, nullable=True)


class Player(Player_Columns, Base):
    __tablename__ = "elements"


class PlayerLatest(Player_Columns, Base):
    __tablename__ = "latest_elements"


class TeamOfPlayers(Timestamp_Column):

    primary_key = Column(String(50), primary_key=True)
    element = Column(Integer)
    event = Column(Integer)
    position = Column(Integer)
    multiplier = Column(Integer)
    is_captain = Column(Boolean)
    is_vice_captain = Column(Boolean)
    first_name = Column(String(50))
    second_name = Column(String(50))
    element_name = Column(String(50))
    cost = Column(Float)
    event_points = Column(Integer)


class PickedTeam(TeamOfPlayers, Base):
    __tablename__ = "picked_team"


class SelectedTeam(TeamOfPlayers, Base):
    __tablename__ = "selected_team"


class HighestTeam(TeamOfPlayers, Base):
    __tablename__ = "highest_expected_points"

    period_qualifier = Column(String, nullable=True)
    element_type = Column(Integer, nullable=True)
    ep_next = Column(Float, nullable=True)
    ep_this = Column(Float, nullable=True)


class Team(Base):
    __tablename__ = "teams"

    code = Column(Integer, primary_key=True)
    draw = Column(Integer)
    form = Column(Integer, nullable=True)
    id = Column(Integer)
    loss = Column(Integer)
    name = Column(String(50))
    played = Column(Integer)
    points = Column(Integer)
    position = Column(Integer)
    short_name = Column(String(50))
    strength = Column(Integer, nullable=True)
    team_division = Column(String(50), nullable=True)
    unavailable = Column(Boolean)
    win = Column(Integer)
    strength_overall_home = Column(Integer)
    strength_overall_away = Column(Integer)
    strength_attack_home = Column(Integer)
    strength_attack_away = Column(Integer)
    strength_defence_home = Column(Integer)
    strength_defence_away = Column(Integer)
    pulse_id = Column(Integer)


class Fixture(Base):
    
    __tablename__ = 'fixtures'

    fixture_id = Column(String, primary_key=True)
    code = Column(Integer)
    event = Column(Integer)
    finished = Column(Boolean)
    finished_provisional = Column(Boolean)
    id = Column(Integer)
    kickoff_time = Column(DateTime)
    minutes = Column(Integer)
    provisional_start_time = Column(Boolean)
    started = Column(Boolean)
    team_a = Column(Integer)
    team_a_score = Column(Integer)
    team_h = Column(Integer)
    team_h_score = Column(Integer)
    home_team_id = Column(Integer)
    home_team_code = Column(Integer)
    home_team_name = Column(String)
    home_team_position = Column(Integer)
    home_team_strength = Column(Integer)
    away_team_id = Column(Integer)
    away_team_code = Column(Integer)
    away_team_name = Column(String)
    away_team_position = Column(Integer)
    away_team_strength = Column(Integer)
    # stats = Column(ARRAY(item_type=String, dimensions=1), True)
    team_h_difficulty = Column(Integer)
    team_a_difficulty = Column(Integer)
    pulse_id = Column(Integer)
