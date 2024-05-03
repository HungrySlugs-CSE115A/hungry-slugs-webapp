from bs4.element import Tag, ResultSet
from bs4 import BeautifulSoup

from food import Food
from helpers import get_next_sibling, tag_to_bs4


class Category:
    def __init__(self, name: str, html_list: list[Tag]) -> None:
        self.name = name
        self.foods: list[Food] = [Food(html) for html in html_list]

    def __str__(self) -> str:
        result = f"{self.name}\n"
        for food in self.foods:
            result += (" " * 2) + str(food) + "\n"
        return result


class MealTime:
    def __init__(self, name: str, html: Tag) -> None:
        self.name = name
        self.categories: list[Category] = self.__process_data(html)

    def __process_data(self, html: Tag) -> list[Category]:
        # convert the html to a BeautifulSoup object
        soup = tag_to_bs4(html)

        # find the categories in the meal time
        categories_data: ResultSet = soup.find_all("div", class_="shortmenucats")

        # get the categorie names
        if not categories_data:
            return []
        categories_names: list[str] = []
        for cat in categories_data:
            categories_names.append(cat.get_text(strip=True))

        # get the 2nd parent of the first category
        html_data: Tag | None = categories_data[0]
        for i in range(2):
            if html_data:
                html_data = html_data.parent

        # cotinue getting the next sibling until next category or None
        categories: list[Category] = []
        food_html_data: list[Tag] = []
        while True:
            # get the next sibling
            if not html_data:
                break
            next_sibling: Tag | None = get_next_sibling(html_data)
            if not next_sibling:
                break

            # update the html data
            html_data = next_sibling

            # check if the next sibling is a category
            if next_sibling.find("div", class_="shortmenucats"):
                # create the category
                category = Category(categories_names.pop(0), food_html_data)
                categories.append(category)
                food_html_data = []  # reset the food html data
                continue

            # add the food html data
            food_html_data.append(next_sibling)

        return categories

    def __str__(self) -> str:
        result = f"{self.name}\n"
        for cat in self.categories:
            result += str(cat)
        return result
