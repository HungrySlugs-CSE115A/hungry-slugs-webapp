import requests
from bs4 import BeautifulSoup

from private.private_settings import UCSC_SSL_CERT


class DiningHall:
    def __init__(self, url: str) -> None:
        self.name = ""
        # self.meals = {"Breakfast": [], "Lunch": [], "Dinner": [], "Late Night": []}
        self.meals = {}
        self.meal_times = {}
        self.__retrieve_data(url)

    def get_name(self) -> str:
        return self.name

    def get_meals(self) -> dict:
        return self.meals

    def __retrieve_data(self, url: str) -> None:
        cookies = {
            "WebInaCartLocation": "",
            "WebInaCartDates": "",
            "WebInaCartMeals": "",
            "WebInaCartRecipes": "",
            "WebInaCartQtys": "",
        }

        try:
            response = requests.get(url, cookies=cookies, verify=UCSC_SSL_CERT)
        except requests.exceptions.RequestException as e:  # This is the correct syntax
            raise SystemExit(e)

        html_text = response.text  # id imagine this is data from the website
        soup = BeautifulSoup(html_text, "html.parser")

        name = soup.find_all(
            "div", class_="headlocation"
        )  # gets the name of the dinign hall using "headlocation" tag/div?
        if name:
            self.name = name[0].get_text()  # get_text returns the text in the tag
            print(self.name)

        # find the meal headers

        meal_time_per_dh = soup.find_all(
            "div", class_="shortmenumeals"
        )  # gets the name of the dinign hall using "headlocation" tag/div?
        if meal_time_per_dh:
            for i in meal_time_per_dh:
                self.meal_times[i.get_text()] = (
                    []
                )  # creates dictionary for each dh ie Crown: [] Cowell: []
                # print( i.get_text() ) #get_text returns the text in the tag

        self.meals = self.meal_times
        mt_index = -1
        for element in soup.find_all(  # element stores the instances of each meal
            "div",
            {
                "class": ["shortmenurecipes", "shortmenumeals"]
            },  # gets the breakfast lunch dinenr
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

    def __str__(self) -> str:
        result = f"{self.name}\n"
        for meal_time in self.meals.keys():
            result += f"    {meal_time}:\n"
            for food in self.meals[meal_time]:
                result += f"        {food}\n"

        result += "\n"
        return result

    def jsonify(self) -> dict:
        result = {"name": self.name, "meals": self.meals}
        return result
