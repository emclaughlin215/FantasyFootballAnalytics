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
        self.df['form_to_cost'] = self.df['form'] / self.df['now_cost']
        self.df['bonus_to_cost'] = self.df['form'] / self.df['now_cost']

        return

    def handleElementTypes(self):
        self.df.drop(["sub_positions_locked"], axis=1, inplace=True)

        return

    def handleEvents(self):
        self.df.drop(["chip_plays"], axis=1, inplace=True)

        return

    def handleGeneric(self):

        return

    def storeData(self):

        tableNames = [("element_types", self.handleElementTypes),
                      ("elements", self.handleElements),
                      ("events", self.handleEvents),
                      ("phases", self.handleGeneric),
                      ("teams", self.handleGeneric)]

        for tableName in tableNames:

            self.df = pd.DataFrame(self.dataJson[tableName[0]])
            self.df['timestamp'] = pd.to_datetime('now')
            tableName[1]()

            try:
                self.df.to_sql(name=tableName[0], con=cnx, if_exists='replace', index=True)
            except ValueError as vx:
                print(vx)
            except Exception as ex:
                print(ex)
            else:
                print("Table created successfully.")
