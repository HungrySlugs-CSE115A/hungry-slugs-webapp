import requests
from bs4 import BeautifulSoup

from bs4.element import ResultSet, Tag

from webscraper.category import Category
from webscraper.helpers import get_next_sibling

from private.private_settings import UCSC_SSL_CERT


class DiningHall:
    def __init__(self, url: str) -> None:
        self.name: str = "Error: Name not found"
        self.categories: list[Category] = self._retrieve_data(url)
        print(self.name)

    def is_empty(self) -> bool:
        # empty if all categories are empty
        return all(category.is_empty() for category in self.categories) or (
            len(self.categories) == 0
        )

    def _retrieve_data(self, url: str) -> list[Category]:
        # Set the cookies to be empty to avoid loading nothing
        cookies = {
            "WebInaCartLocation": "",
            "WebInaCartDates": "",
            "WebInaCartMeals": "",
            "WebInaCartRecipes": "",
            "WebInaCartQtys": "",
        }

        # Get the data from the website
        try:
            page = requests.get(url, cookies=cookies, verify=UCSC_SSL_CERT)
        except requests.exceptions.RequestException as e:
            raise SystemExit(e)

        # create a BS4 object by parsing the html text
        soup = BeautifulSoup(page.content, "html.parser")

        # find the name of the dining hall
        name: Tag | None = soup.find("div", class_="headlocation")

        # if the name exists, set the name to the first element in the list
        if name:
            self.name = name.get_text(strip=True)

        # find the category time headers on the menu
        mt_data: ResultSet = soup.find_all("div", class_="shortmenumeals")

        # get the category time names
        mt_names = [mt.get_text(strip=True) for mt in mt_data]

        # get the 5th parent of the category times
        for i in range(5):
            for j in range(len(mt_data)):
                # get the parent of the category time
                parent = mt_data[j].parent

                # check if the parent exists
                if not parent:
                    continue

                # set the category time to the parent
                mt_data[j] = parent

        # get the tag after the category time header (category time data)
        for i in range(len(mt_data)):
            # get the next sibling of the category time (skip the first next sibling)
            next_sib = get_next_sibling(mt_data[i])

            # check if the next sibling exists
            if not next_sib:
                continue

            # set the category time data to the next sibling
            mt_data[i] = next_sib

        # create a list of category time objects
        categories: list[Category] = []
        for i in range(len(mt_data)):
            categories.append(Category(mt_names[i], mt_data[i]))

        # return the category times
        return categories

    def __str__(self) -> str:
        result = self.name + "\n"
        for category in self.categories:
            result += str(category) + "\n"
        return result

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "categories": [category.to_dict() for category in self.categories],
        }


if __name__ == "__main__":
    dh = DiningHall(
        "https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=College+Nine%2fJohn+R.+Lewis+Dining+Hall&naFlag=1"
    )
    print(dh)
