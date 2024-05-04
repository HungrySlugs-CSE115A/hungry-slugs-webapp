from bs4 import BeautifulSoup as soup
from bs4.element import Tag

class food_data:
    def __init__(self,  html: Tag) -> None:
        self.data = []
        self.__get_extra_data(html)
        print(self.data)

    def __get_extra_data(self, html: Tag):
        # print(html.prettify())
        for tags in html.find_all('img'):
            self.data.append(tags['src'])
