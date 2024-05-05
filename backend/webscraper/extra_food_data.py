from bs4 import BeautifulSoup as soup
from bs4.element import Tag

class food_data:
    def __init__(self,  html: Tag) -> None:
        self.data = []
        self.__get_extra_data(html)
        

    def __get_extra_data(self, html: Tag):
        # print(html.prettify())
        for tags in html.find_all('img'):
            self.data.append(tags['src'].replace("LegendImages/", ""))
        

    
    def __str__(self) -> str:
        if len(self.data) ==0:
            return 'No allergies'
        else:
            s= ",".join( [ str(element) for element in self.data ] )
            return f'Allergies --> {s}'
        
