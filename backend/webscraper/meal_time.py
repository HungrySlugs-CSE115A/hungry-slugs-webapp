from bs4.element import Tag
from bs4 import BeautifulSoup

from helpers import get_next_sibling, tag_to_bs4

class MealTime:
    def __init__(self, name: str, html: Tag) -> None:
        self.name = name
        self.categories: list[SubCategory] = self.__process_data(html)

    def __process_data(self, html: Tag) -> list:
        # convert the html to a BeautifulSoup object
        soup = tag_to_bs4(html)

        print(soup.prettify())

        return []
        

        # get the names of the categories
        if not categories_data:
            return []
        categories_names: list[str] = [cat.get_text(strip=True) for cat in categories_data]

        # get the html for each food after the category



    # def __str__(self) -> str:
    #     result = f"{self.name}\n"
    #     for sub_category in self.sub_categories:
    #         result += " "*4 str(sub_category)
    #     return result 

class SubCategory:
    def __init__(self, name: str, html_list: list[Tag]) -> None:
        self.name = name
        
    #     self.foods: list[Food] = self.__process_data(html)

    # def __process_data(self, html: ResultSet) -> list[Food]:
    #     # find the food items in the sub category
    #     foods = html.find_all("div", class_="shortmenurecipes")

    # def __str__(self) -> str:
    #     result = f"{self.name}\n"
    #     result += str(self.html).split("\n")[0]

    #     return result
        
