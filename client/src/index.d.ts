import React from 'react';


export interface IStringElementMap {
  [key: string]: JSX.Element;
}

export interface IStringFunctionMap {
  [key: string]: Function;
}

export interface IPlayerType {
  index?: number
  id?: number
  plural_name: string
  plural_name_short?: string
  singular_name?: string
  singular_name_short?: string
  squad_select?: number
  squad_min_play?: number
  squad_max_play?: number
  ui_shirt_specific?: boolean
  element_count?: number
  timestamp?: Date
}


export interface IPlayer {
  primary_key: string
  id: number
  chance_of_playing_this_round: float
  chance_of_playing_next_round: float
  code: number
  cost_change_event: float
  cost_change_event_fall: float
  cost_change_start: float
  cost_change_start_fall: float
  dreamteam_count: number
  element_type: number
  element_name: string
  element_name_short: string
  ep_next: number
  ep_this: number
  event: number
  event_points: number
  first_name: string
  form: number
  in_dreamteam: boolean
  news: string
  news_added: string
  now_cost: number
  cost: number
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
  corners_and_indirect_freekicks_order: number
  corners_and_indirect_freekicks_text: string
  direct_freekicks_order: number
  direct_freekicks_text: string
  penalties_order: number
  penalties_text: string
  form_to_cost: number
  bonus_to_cost: number
  timestamp: Date
  selected_by_percent_change: number
}


export interface ITeam {
  draw?: number
  form?: number
  id?: number
  loss?: number
  name: string
  played?: number
  points?: number
  position?: number
  short_name?: string
  strength?: number
  team_division?: string
  unavailable?: boolean
  win?: number
  strength_overall_home?: number
  strength_overall_away?: number
  strength_attack_home?: number
  strength_attack_away?: number
  strength_defence_home?: number
  strength_defence_away?: number
  pulse_id?: number
}

export interface IDisplayTeam {
  team: {[key: number]: IDisplayPlayer}
  cost: number
  expected_points: number
  actual_points: number
}

export interface IDisplayPlayer extends IPlayer {
  event?: int
  position?: int
  multiplier?: int
  is_captain?: bool
  is_vice_captain?: bool
  element_name?: str
  period_qualifier?: str
}

export interface IGameweek {
  index: int
  id?: int
  name?: str
  deadline_time?: str
  average_entry_score?: int
  finished?: bool
  data_checked?: bool
  highest_scoring_entry?: int
  deadline_time_epoch?: int
  deadline_time_game_offset?: int
  highest_score?: int
  is_previous?: bool
  is_current?: bool
  is_next?: bool
  most_selected?: int
  most_transferred_in?: int
  top_element?: int
  transfers_made?: int
  most_captained?: int
  most_vice_captained?: int
}

export interface IGameweekInfo {
  previous: IGameweek
  current: IGameweek
  next: IGameweek
}

export interface IPlayerFixture {
  event: int
  opponent_id: int
  opponent_name: str
  opponent_difficulty: int
  fixture_type: int
}

export interface IChange {
  transfer_cost: float
  points_gain: float
  id_player_in: int
  id_player_out: int
  first_name_player_in: str
  first_name_player_out: str
  web_name_player_in: str
  web_name_player_out: str
  second_name_player_in: str
  second_name_player_out: str
  cost_player_in: float
  cost_player_out: float
  ep_next_player_in: float
  ep_next_player_out: float
}

export interface ISubmitPlayer {
	element: number,
  position: number,
  is_captain: boolean,
  is_vice_captain: boolean,
}

export interface ISubmitTeam {
  chip: string | null = null,
  picks: ISubmitPlayer[],
}


export interface ISubmitTransfer {
  element_in: number,
  element_out: number,
  purchase_price: number,
  selling_price: number,
}

export interface ISubmitTransfers {
  chip: string | null = null,
  event: number,
  entry: null,
  transfers: ISubmitTransfer[],
}

export interface IChipsMetadata {
  status_for_entry: ('played' | 'available')
  played_by_entry: number[]
  name: ('wildcard' | '3xc' | 'bboost' | 'freehit')
  number: number
  start_event: number
  stop_event: number
  chip_type: ('transfer' | 'team')
}

export interface ITransfersMetadata {
  cost: number
  status: string
  limit: number
  made: number
  bank: number
  value: number
}

export interface IMetadata {
  chips: IChipsMetadata[],
  transfers: ITransfersMetadata,
}