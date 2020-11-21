# import mysql.connector
# import requests
# import pandas as pd
# import sys
#
# from server.api import database, env
#
#
# class StoreFplData:
#
#     def __init__(self):
#
#         # Retrieve Data
#         url_data = 'https://fantasy.premierleague.com/api/bootstrap-static/'
#         try:
#             response_data = requests.get(url_data)
#         except ConnectionError:
#             sys.exit("Failed to get data from the FPL API")
#         self.dataJson = response_data.json()
#
#         # Get latest gameweek stored for picked team
#         my_db = mysql.connector.connect(
#             username=env.environment.get('user'),
#             password=env.environment.get('password'),
#             host=env.environment.get('host')
#         )
#         my_cursor = my_db.cursor()
#         my_cursor.execute("SELECT event FROM fantasypremierleague.picked_team ORDER BY event")
#         game_week_rows = my_cursor.fetchall()
#         if len(game_week_rows) == 0:
#             game_week = 4
#         else:
#             game_week = game_week_rows[0][0] + 1
#         self.game_week = game_week
#
#         # Retrieve team gameweek points data
#         url_team = 'https://fantasy.premierleague.com/api/entry/5626217/event/' + str(game_week) + '/picks/'
#         try:
#             response_team = requests.get(url_team)
#         except ConnectionError:
#             sys.exit("Failed to get team points data.")
#
#         self.pointsTeamJson = response_team.json()
#         self.df = None
#
#         headers = {"Cookie":
#                        'pl_profile=""eyJzIjogIld6SXNNemt5TlRRME9GMDoxa1dKRXI6c2VKVmN6bXpPellyR05JS0FNbmp0UF95NTBZIiwgInUiOiB7ImlkIjogMzkyNTQ0OCwgImZuIjogIkVkd2FyZCIsICJsbiI6ICJNY2xhdWdobGluIiwgImZjIjogMTR9fQ==""; csrftoken=0kcum42jQOMSGw6OtDjHtdW85c3crJ73MI68b9se45Vpa0UNpVN9FgDviFOeL8Xl;" \
#                        "sessionid=.eJyrVopPLC3JiC8tTi2Kz0xRslIytjQyNTGxUNJBlklKTM5OzQNJF-SkFeTogWT0AnxCgXLFwcH-jkAuqoaMxOIMoGpLQxPLxLRUc2Mjs5SUVPMUQ2PDVDNjUwtDS7NkA8NUQwMLE4vUNENLpVoAXDgrvg:1kWJEs:12mlMhGcJj_p23Lmq-psC4Lur2k"'}
#         # Retrieve selected team data
#         url_team = 'https://fantasy.premierleague.com/api/my-team/5626217/'
#         try:
#             response_selected = requests.get(url_team, headers=headers)
#         except ConnectionError:
#             sys.exit("Failed to get selected team data.")
#
#         self.selectedTeamJson = response_selected.json()
#         self.df = None
#
#     def handleElements(self):
#         self.df['form'] = pd.to_numeric(self.df['form'])
#         self.df['cost'] = self.df['now_cost'] / 10
#         self.df['form_to_cost'] = self.df['form'] / self.df['now_cost']
#         self.df['bonus_to_cost'] = self.df['bonus'] / self.df['now_cost']
#
#         primary_key_cols = ['id', 'timestamp']
#         self.df['primary_key'] = self.df[primary_key_cols].apply(lambda row: '_'.join(row.values.astype(str)), axis=1)
#
#         return
#
#     def handleElementTypes(self):
#         self.df.drop(["sub_positions_locked"], axis=1, inplace=True)
#
#         return
#
#     def handleEvents(self):
#         self.df.drop(["chip_plays"], axis=1, inplace=True)
#         self.df.drop(["top_element_info"], axis=1, inplace=True)
#
#         return
#
#     def handleGeneric(self):
#
#         return
#
#     def storeData(self, type_of_storing, table_name):
#
#         table_names = {"element_types": self.handleElementTypes,
#                        "elements": self.handleElements,
#                        "events": self.handleEvents,
#                        "phases": self.handleGeneric,
#                        "teams": self.handleGeneric,
#                        }
#
#         self.df = pd.DataFrame(self.dataJson[table_name])
#         self.df['timestamp'] = pd.to_datetime('now')
#         table_names[table_name]()
#
#         try:
#             self.df.to_sql(name=table_name, con=database.cnx, if_exists=type_of_storing, index=True)
#         except ValueError as vx:
#             print(vx)
#         except Exception as ex:
#             print(ex)
#         else:
#             print("Table created successfully.")
#
#     def storeTeamPoints(self):
#         elements_df = pd.DataFrame(self.dataJson['elements'])
#         element_types_df = pd.DataFrame(self.dataJson['element_types'])
#         my_team_df = pd.DataFrame(self.pointsTeamJson['picks'])
#
#         elements_df['element_name'] = elements_df.element_type.map(element_types_df.set_index('id').singular_name)
#
#         my_team_df['first_name'] = my_team_df.element.map(elements_df.set_index('id').first_name)
#         my_team_df['second_name'] = my_team_df.element.map(elements_df.set_index('id').second_name)
#         my_team_df['element_name'] = my_team_df.element.map(elements_df.set_index('id').element_name)
#         my_team_df['cost'] = my_team_df.element.map(elements_df.set_index('id').now_cost / 10)
#         my_team_df['gameweek_points'] = my_team_df.element.map(elements_df.set_index('id').event_points)
#         my_team_df['event'] = self.game_week
#         primary_key_cols = ['element', 'event']
#         my_team_df['primary_key'] = my_team_df[primary_key_cols] \
#             .apply(lambda row: '_'.join(row.values.astype(str)), axis=1)
#
#         try:
#             my_team_df.to_sql(name='picked_team', con=database.cnx, if_exists='append', index=True)
#         except ValueError as vx:
#             print(vx)
#         except Exception as ex:
#             print(ex)
#         else:
#             print("Table created successfully.")
#
#     def storeTeam(self):
#         elements_df = pd.DataFrame(self.dataJson['elements'])
#         element_types_df = pd.DataFrame(self.dataJson['element_types'])
#         my_team_df = pd.DataFrame(self.selectedTeamJson['picks'])
#
#         elements_df['element_name'] = elements_df.element_type.map(element_types_df.set_index('id').singular_name)
#
#         my_team_df['first_name'] = my_team_df.element.map(elements_df.set_index('id').first_name)
#         my_team_df['second_name'] = my_team_df.element.map(elements_df.set_index('id').second_name)
#         my_team_df['element_name'] = my_team_df.element.map(elements_df.set_index('id').element_name)
#         my_team_df['cost'] = my_team_df.element.map(elements_df.set_index('id').now_cost / 10)
#         my_team_df['gameweek_points'] = my_team_df.element.map(elements_df.set_index('id').event_points)
#         my_team_df['event'] = self.game_week
#         primary_key_cols = ['element', 'event']
#         my_team_df['primary_key'] = my_team_df[primary_key_cols] \
#             .apply(lambda row: '_'.join(row.values.astype(str)), axis=1)
#
#         try:
#             my_team_df.to_sql(name='selected_team', con=database.cnx, if_exists='replace', index=True)
#         except ValueError as vx:
#             print(vx)
#         except Exception as ex:
#             print(ex)
#         else:
#             print("Table created successfully.")
