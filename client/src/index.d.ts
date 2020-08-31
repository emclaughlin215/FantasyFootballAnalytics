import React from 'react';


export interface IStringElementMap {
  [key: string]: JSX.Element;
}


export interface IPlayerType {
  index: number
  id: number
  plural_name: string
  plural_name_short: string
  singular_name: string
  singular_name_short: string
  squad_select: number
  squad_min_play: number
  squad_max_play: number
  ui_shirt_specific: boolean
  element_count: number
  timestamp: Date
}


export interface IPlayer {
  id: number;
  chance_of_playing_this_round: number
  chance_of_playing_next_round: number
  code: number
  cost_change_event: number
  cost_change_event_fall: number
  cost_change_start: number
  cost_change_start_fall: number
  dreamteam_count: number
  element_type: number
  ep_next: number
  ep_this: number
  event_points: number
  first_name: string
  form: number
  in_dreamteam: boolean
  news: string
  news_added: number
  now_cost: number
  photo: string
  points_per_game: number
  second_name: string
  selected_by_percent: number
  special: boolean
  squad_number: number
  status: string
  team: number
  team_code: number
  total_points: number
  transfers_in: number
  transfers_in_event: number
  transfers_out: number
  transfers_out_event: number
  value_form: number
  value_season: number
  web_name: string
  minutes: number
  goals_scored: number
  assists: number
  clean_sheets: number
  goals_conceded: number
  own_goals: number
  penalties_saved: number
  penalties_missed: number
  yellow_cards: number
  red_cards: number
  saves: number
  bonus: number
  bps: number
  influence: number
  creativity: number
  threat: number
  ict_index: number
  influence_rank: number
  influence_rank_type: number
  creativity_rank: number
  creativity_rank_type: number
  threat_rank: number
  threat_rank_type: number
  ict_index_rank: number
  ict_index_rank_type: number
  form_to_cost: number
  bonus_to_cost: number
}


export interface ITeam {
  draw: number
  form: number
  id: number
  loss: number
  name: string
  played: number
  points: number
  position: number
  short_name: string
  stringength: number
  team_division: string
  unavailable: boolean
  win: number
  stringength_overall_home: number
  stringength_overall_away: number
  stringength_attack_home: number
  stringength_attack_away: number
  stringength_defence_home: number
  stringength_defence_away: number
  pulse_id: number
}