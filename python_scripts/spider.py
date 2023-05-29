#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import json
from bs4 import BeautifulSoup


class Spider:
    def __init__(self, host, locale, t='l2', min_price=0, max_price=0):
        self.base_url = host
        self.ershoufang_url = self.base_url + '/ershoufang'
        self.locale = locale
        self.price = 'bp' + str(min_price) + 'ep' + str(max_price) if max_price>0 else ""
        self.type = t


    def requestLocale(self):
        page = 1
        total_page = 1

        data = []
        while True:
            url = self.ershoufang_url + '/pg' + str(page) + self.type + self.price + 'rs' + self.locale + '/'
            soup = BeautifulSoup(self.__requestsGet(url), 'lxml')

            if total_page == 1 and soup.find('div', {'class': 'page-box fr'}):
                total_page = json.loads(soup.find('div', {'class': 'page-box fr'}).div.attrs['page-data'])['totalPage']
        
            data += self.__extractInformation(soup)
            
            if page == total_page:
                break
            page += 1
        return data

    def __requestsGet(self, url):
        headers={
                "User-Agent" : "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.1.6)",
                "Accept" : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language" : "en-us",
                "Connection" : "keep-alive",
                "Accept-Charset" : "GB2312,utf-8;q=0.7,*;q=0.7"}
        r = requests.get(url, headers=headers)
        html = r.text
        return html

    def __extractInformation(self, soup):
        house_list = soup.find('ul', {'class': 'sellListContent'})
        data = []
        for house in house_list:
            info = house.find("div" , {'class': 'info'}, recursive=False)
            
            house_title = info.find("div" , {'class': 'title'}, recursive=False).a
            house_id = int(house_title.attrs['href'].split('/')[-1][:-5])

            house_location = info.find("div" , {'class': 'flood'}, recursive=False).div.a.string

            address = info.find("div" , {'class': 'address'}, recursive=False).text.split(' | ')
            house_type = address[0]
            house_size = address[1]
            house_towards = address[2]
            house_flood = address[4]
            if len(address) < 7:
                house_year = ""
                house_building = address[5]
            else:
                house_year = address[5]
                house_building = address[6]


            priceInfo = info.find("div" , {'class': 'priceInfo'}, recursive=False)
            house_total_price = priceInfo.find("div" , {'class': 'totalPrice'}, recursive=False).span.string + "万"
            house_unit_price = priceInfo.find("div", {'class': 'unitPrice'},recursive=False).span.string[2:-4]

            data.append({'house_id': house_id, 'house_location': house_location, 'house_type': house_type, 'house_size': house_size, 'house_towards': house_towards, 'house_flood': house_flood, 'house_year': house_year, 'house_building': house_building, 'house_total_price': house_total_price, 'house_unit_price': house_unit_price})
        return data
    
