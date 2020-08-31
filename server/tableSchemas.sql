// Elements
CREATE TABLE IF NOT EXISTS `elements` (chance_of_playing_next_round FLOAT, chance_of_playing_this_round INT, code BIGINT, cost_change_event BIGINT, cost_change_event_fall BIGINT, cost_change_start BIGINT, cost_change_start_fall BIGINT, dreamteam_count BIGINT, element_type BIGINT, ep_next INT, ep_this INT, event_points BIGINT, first_name VARCHAR(60), form INT, id BIGINT, in_dreamteam BOOLEAN, news VARCHAR(60), news_added INT, now_cost BIGINT, photo VARCHAR(30), points_per_game INT, second_name VARCHAR(30), selected_by_percent INT, special BOOLEAN, squad_number INT, status VARCHAR(30), team BIGINT, team_code BIGINT, total_points BIGINT, transfers_in BIGINT, transfers_in_event BIGINT, transfers_out BIGINT, transfers_out_event BIGINT, value_form INT, value_season INT, web_name VARCHAR(30), minutes BIGINT, goals_scored BIGINT, assists BIGINT, clean_sheets BIGINT, goals_conceded BIGINT, own_goals BIGINT, penalties_saved BIGINT, penalties_missed BIGINT, yellow_cards BIGINT, red_cards BIGINT, saves BIGINT, bonus BIGINT, bps BIGINT, influence INT, creativity INT, threat INT, ict_index INT, influence_rank BIGINT, influence_rank_type BIGINT, creativity_rank BIGINT, creativity_rank_type BIGINT, threat_rank BIGINT, threat_rank_type BIGINT, ict_index_rank BIGINT, ict_index_rank_type BIGINT);
CREATE TABLE IF NOT EXISTS `element_types` (id BIGINT, plural_name VARCHAR(30), plural_name_short VARCHAR(30), singular_name VARCHAR(30), singular_name_short VARCHAR(30), squad_select BIGINT, squad_min_play BIGINT, squad_max_play BIGINT, ui_shirt_specific BOOLEAN, sub_positions_locked INT, element_count BIGINT);
CREATE TABLE IF NOT EXISTS `teams` (code BIGINT, draw BIGINT, form INT, id BIGINT, loss BIGINT, name VARCHAR(30), played BIGINT, points BIGINT, position BIGINT, short_name VARCHAR(30), strength INT, team_division VARCHAR(30), unavailable BOOLEAN, win BIGINT, strength_overall_home BIGINT, strength_overall_away BIGINT, strength_attack_home BIGINT, strength_attack_away BIGINT, strength_defence_home BIGINT, strength_defence_away BIGINT, pulse_id BIGINT);
CREATE TABLE IF NOT EXISTS `phases` (id BIGINT, name VARCHAR(30), start_event BIGINT, stop_event BIGINT);
CREATE TABLE IF NOT EXISTS `events` (code BIGINT, draw BIGINT, form INT, id BIGINT, loss BIGINT, name VARCHAR(30), played BIGINT, points BIGINT, position BIGINT, short_name VARCHAR(30), strength INT, team_division VARCHAR(30), unavailable BOOLEAN, win BIGINT, strength_overall_home BIGINT, strength_overall_away BIGINT, strength_attack_home BIGINT, strength_attack_away BIGINT, strength_defence_home BIGINT, strength_defence_away BIGINT);

