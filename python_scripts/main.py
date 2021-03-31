#!/usr/bin/env python
# -*- coding: utf-8 -*-a

from spider import Spider
from database import Database
import json
import sys
from datetime import datetime, timedelta


with open(sys.path[0] + '/../config/config.json', 'r') as f:
    config = json.loads(f.read())

spy = Spider(config['host'], config['locale'], config['type'], config['min_price'], config['max_price'])
data = spy.requestLocale()

db = Database()

date = datetime.today().strftime('%Y-%m-%d')

new_count = 0
new_list = []

change_count = 0
change_list = []

for house in data:
    old_data = list(db.selectHouse(house['house_id']))
    if len(old_data) == 0:
        new_count += 1
        new_list.append(config['host'] + '/ershoufang/%d.html'%house['house_id'])

        house['house_date_price'] = json.dumps({date: [house['house_total_price'], house['house_unit_price']]})
        db.insertHouse(house)
    else:
        old_date_price = json.loads(old_data[0][-1])
        if date not in old_date_price:
            old_date_price[date] = [house['house_total_price'], house['house_unit_price']]
            house['house_date_price'] = json.dumps(old_date_price)
            db.updateHouse(house)

            last_date = sorted(old_date_price.keys())[-2]
            if old_date_price[last_date] != old_date_price[date]:
                change_count += 1
                change_list.append(config['host'] + '/ershoufang/%d.html'%house['house_id'])

print(date)
print("新增%d套房源"%new_count)
print(new_list)
print("价格变动%d套房源"%change_count)
print(change_list)
if db.countHouse() > len(data):
    print("减少%d套房源"%(db.countHouse() - len(data)))
    delete_list = []
    for item in list(db.findAllSellOutFromHouse(date)):
        delete_list.append(config['host'] + '/ershoufang/%d.html'%item[0])

        del_data = list(db.selectHouse(item[0]))[0]
        db.insertSellOut({
            'house_id': del_data[0],
            'house_location': del_data[1], 
            'house_type': del_data[2], 
            'house_size': del_data[3], 
            'house_towards': del_data[4], 
            'house_flood': del_data[5], 
            'house_year': del_data[6], 
            'house_building': del_data[7], 
            'house_total_price': del_data[8], 
            'house_unit_price': del_data[9], 
            'house_date_price': del_data[10], 
            'date': date
        })

        db.deleteHouse(item[0])

    print(delete_list)