from re import sub
from bs4.element import Tag, ResultSet

from webscraper.food import Food
from webscraper.helpers import get_next_sibling


class SubCategory:
    def __init__(self, name: str, html_list: list[Tag]) -> None:
        self.name = name
        self.foods: list[Food] = [Food(html) for html in html_list]

    def is_empty(self) -> bool:
        return len(self.foods) == 0

    def __str__(self) -> str:
        result = f"{self.name}\n"
        for food in self.foods:
            result += (" " * 2) + str(food) + "\n"
        return result

    def to_dict(self) -> dict:
        return {"name": self.name, "foods": [food.to_dict() for food in self.foods]}


class Category:
    def __init__(self, name: str, html: Tag) -> None:
        self.name = name
        self.sub_categories: list[SubCategory] = self._process_data(html)

    def is_empty(self) -> bool:
        return all(sub_cat.is_empty() for sub_cat in self.sub_categories) or (len(self.sub_categories) == 0)

    def _process_data(self, html: Tag) -> list[SubCategory]:
        # find the categories in the meal time
        sub_cat_data: ResultSet = html.find_all("div", class_="shortmenucats")

        # get the categorie names
        if not sub_cat_data:
            return []
        sub_cat_names: list[str] = []
        for sub_cat in sub_cat_data:
            sub_cat_names.append(sub_cat.get_text(strip=True))

        # get the 2nd parent of the first category
        html_data: Tag | None = sub_cat_data[0]
        for _ in range(2):
            if html_data:
                html_data = html_data.parent

        # continue getting the next sibling until next category or None
        sub_categories: list[SubCategory] = []
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
                sub_cat = SubCategory(sub_cat_names.pop(0), food_html_data)
                sub_categories.append(sub_cat)
                food_html_data = []  # reset the food html data
                continue

            # add the food html data
            food_html_data.append(next_sibling)

        return sub_categories

    def __str__(self) -> str:
        result = f"{self.name}\n"
        for sub_cat in self.sub_categories:
            result += str(sub_cat)
        return result

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "sub_categories": [sub_cat.to_dict() for sub_cat in self.sub_categories],
        }
