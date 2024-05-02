import requests
from bs4 import BeautifulSoup

from bs4.element import ResultSet, Tag

from meal_time import MealTime
from helpers import get_next_sibling

from private.private_settings import UCSC_SSL_CERT

class DiningHall:
    def __init__(self, url: str) -> None:
        self.name: str = "Error: Name not found"
        self.meal_times: list = self.__retrieve_data(url)

    def __retrieve_data(self, url: str) -> list:
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
        name: Tag|None = soup.find("div", class_="headlocation")

        # if the name exists, set the name to the first element in the list
        if name:
            self.name = name.get_text(strip=True)
            print(self.name)

        # find the meal time headers on the menu
        mt_data: ResultSet = soup.find_all("div", class_="shortmenumeals")

        # get the meal time names
        mt_names = [mt.get_text(strip=True) for mt in mt_data]

        # get the 5th parent of the meal times
        for i in range(5):
            for j in range(len(mt_data)):
                # get the parent of the meal time
                parent = mt_data[j].parent 

                # check if the parent exists
                if not parent: 
                    continue

                # set the meal time to the parent
                mt_data[j] = parent 

        # get the tag after the meal time header (meal time data)
        for i in range(len(mt_data)):
            # get the next sibling of the meal time (skip the first next sibling)
            next_sib = get_next_sibling(mt_data[i])

            # check if the next sibling exists
            if not next_sib:
                continue

            # set the meal time data to the next sibling
            mt_data[i] = next_sib

        # create a list of meal time objects
        meal_times: list[MealTime] = [MealTime(mt_names[i], mt_data[i]) for i in range(len(mt_names))]

        return meal_times
    
        # if the meal times exist, add them to the meal_times dictionary
        if meal_times:
            for meal_time in meal_times:
                self.meal_times[meal_time.get_text(strip=True)] = {}

        # get all the subcategories and the meal times
        mt_subcat = soup.find_all("div", attrs={"class": ["shortmenumeals", "shortmenucats"]})

        # add all the subcategories to the meal_times dictionary
        if mt_subcat:
            for subcat in mt_subcat:
                # check if the subcategory is not a meal time
                text = subcat.get_text(strip=True)
                if text != self.meal_times.keys():
                    self.meal_times[text] = []


        # find all the foods and meals in one list
        # NOTE: this has to be done as

        mt_index = -1
        for element in soup.find_all(  # element stores the instances of each meal
            "div",
            {
                "class": ["shortmenumeals", "shortmenucats", "shortmenurecipes"]
            },
        ):
            meal_times = list(
                self.meals.keys()
            )  # currently just "Breakfast": [], "Lunch": [], "Dinner": [], "Late Night": []
            if (
                element.get_text() in meal_times
            ):  # if the element is part of the breakfast lunch dinner,
                mt_index += 1
            else:
                self.meals[meal_times[mt_index]].append(element.get_text(strip=True))

    # def __str__(self) -> str:
    #     result = f"{self.name}\n"
    #     for meal_time in self.meals.keys():
    #         result += f"    {meal_time}:\n"
    #         for food in self.meals[meal_time]:
    #             result += f"        {food}\n"

    #     result += "\n"
    #     return result

    # def __str__(self) -> str:
    #     result = ""
    #     for meal_time in self.meal_times:
    #         result += " "*2 + str(meal_time)
    #     return result

if __name__ == "__main__":
    dh = DiningHall("https://nutrition.sa.ucsc.edu/shortmenu.aspx?sName=UC+Santa+Cruz+Dining&locationNum=40&locationName=College+Nine%2fJohn+R.+Lewis+Dining+Hall&naFlag=1")
    # print(dh)