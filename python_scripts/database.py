#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sqlite3
import json
import sys
from datetime import datetime

class Database:
    def __init__(self):
        self.conn = sqlite3.connect(sys.path[0] + '/../db/lianjia.db')
        self.c = self.conn.cursor()

        self.__createHouseTable()
        self.__createSellOutTable()

    def __del__(self):
        self.conn.commit()
        self.conn.close()

    def __createHouseTable(self):
        self.c.execute('''
        CREATE TABLE IF NOT EXISTS HOUSE (
            ID             INT      PRIMARY KEY     NOT NULL,
            LOCATION       TEXT                     NOT NULL,
            TYPE           TEXT                     NOT NULL,
            SIZE           TEXT                     NOT NULL,
            TOWARDS        TEXT                     NOT NULL,
            FLOOD          TEXT                     NOT NULL,
            YEAR           TEXT                     NOT NULL,
            BUILDING       TEXT                     NOT NULL,
            TOTAL_PRICE    TEXT                     NOT NULL,
            UNIT_PRICE     TEXT                     NOT NULL,
            DATE_PRICE     TEXT                     NOT NULL
        );
        ''')

    def __createSellOutTable(self):
        self.c.execute('''
        CREATE TABLE IF NOT EXISTS SELLOUT (
            ID             INT      PRIMARY KEY     NOT NULL,
            LOCATION       TEXT                     NOT NULL,
            TYPE           TEXT                     NOT NULL,
            SIZE           TEXT                     NOT NULL,
            TOWARDS        TEXT                     NOT NULL,
            FLOOD          TEXT                     NOT NULL,
            YEAR           TEXT                     NOT NULL,
            BUILDING       TEXT                     NOT NULL,
            TOTAL_PRICE    TEXT                     NOT NULL,
            UNIT_PRICE     TEXT                     NOT NULL,
            DATE_PRICE     TEXT                     NOT NULL,
            DATE           TEXT                     NOT NULL
        );
        ''')
        
    def insertHouse(self, house):
        self.c.execute("INSERT INTO HOUSE (ID,LOCATION,TYPE,SIZE,TOWARDS,FLOOD,YEAR,BUILDING,TOTAL_PRICE,UNIT_PRICE,DATE_PRICE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (house['house_id'], house['house_location'], house['house_type'], house['house_size'], house['house_towards'], house['house_flood'], house['house_year'], house['house_building'], house['house_total_price'], house['house_unit_price'], house['house_date_price']))

    def updateHouse(self, house):
        self.c.execute("UPDATE HOUSE set TOTAL_PRICE=?, UNIT_PRICE=?, DATE_PRICE=? WHERE ID=?", (house['house_total_price'], house['house_unit_price'], house['house_date_price'], house['house_id']))

    def selectHouse(self, house_id):
        return self.c.execute("SELECT * FROM HOUSE WHERE ID=%d"%(house_id))

    def deleteHouse(self, house_id):
        self.c.execute("DELETE FROM HOUSE WHERE ID=%d;"%house_id)

    def countHouse(self):
        return self.c.execute('''SELECT count() FROM HOUSE''').fetchone()[0]
        # return len(self.c.execute('''SELECT * FROM HOUSE''').fetchall())

    def findAllSellOutFromHouse(self, date):
        return self.c.execute("SELECT * FROM HOUSE WHERE DATE_PRICE NOT LIKE ?", ('%' + date + '%',))

    def insertSellOut(self, house):
        self.c.execute("INSERT INTO SELLOUT (ID,LOCATION,TYPE,SIZE,TOWARDS,FLOOD,YEAR,BUILDING,TOTAL_PRICE,UNIT_PRICE,DATE_PRICE,DATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", (house['house_id'], house['house_location'], house['house_type'], house['house_size'], house['house_towards'], house['house_flood'], house['house_year'], house['house_building'], house['house_total_price'], house['house_unit_price'], house['house_date_price'], house['date']))

    def selectSellOut(self, house_id):
        return self.c.execute("SELECT * FROM SELLOUT WHERE ID=%d"%(house_id))