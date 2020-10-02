import requests
import pandas as pd
import sys

from database import cnx


class StoreFplData:

    def __init__(self):
        url = 'https://fantasy.premierleague.com/api/bootstrap-static/'
        try:
            response = requests.get(url)
        except ConnectionError:
            sys.exit("Failed to get data from the FPL API")
        self.dataJson = response.json()
        self.df = None

    def handleElements(self):
        self.df['form'] = pd.to_numeric(self.df['form'])
        self.df['cost'] = self.df['now_cost'] / 10
        self.df['form_to_cost'] = self.df['form'] / self.df['now_cost']
        self.df['bonus_to_cost'] = self.df['bonus'] / self.df['now_cost']

        primary_key_cols = ['id', 'timestamp']
        self.df['primary_key'] = self.df[primary_key_cols].apply(lambda row: '_'.join(row.values.astype(str)), axis=1)

        return

    def handleElementTypes(self):
        self.df.drop(["sub_positions_locked"], axis=1, inplace=True)

        return

    def handleEvents(self):
        self.df.drop(["chip_plays"], axis=1, inplace=True)
        self.df.drop(["top_element_info"], axis=1, inplace=True)

        return

    def handleGeneric(self):

        return

    def storeData(self, typeOfStoring, tableName):

        tableNames = {"element_types": self.handleElementTypes,
                      "elements": self.handleElements,
                      "events": self.handleEvents,
                      "phases": self.handleGeneric,
                      "teams": self.handleGeneric}

        self.df = pd.DataFrame(self.dataJson[tableName])
        self.df['timestamp'] = pd.to_datetime('now')
        tableNames[tableName]()

        try:
            self.df.to_sql(name=tableName, con=cnx, if_exists=typeOfStoring, index=True)
        except ValueError as vx:
            print(vx)
        except Exception as ex:
            print(ex)
        else:
            print("Table created successfully.")
