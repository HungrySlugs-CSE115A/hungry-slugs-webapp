import requests
from bs4 import BeautifulSoup


class DiningHall:
    def __init__(self, url: str) -> None:
        self.name = ""
        self.meals = {"Breakfast": [], "Lunch": [], "Dinner": [], "Late Night": []}
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
            response = requests.get(url, cookies=cookies, verify=False)
        except requests.exceptions.RequestException as e:  # This is the correct syntax
            raise SystemExit(e)

        html_text = response.text #id imagine this is data from the website
        soup = BeautifulSoup(html_text, "html.parser")

        name = soup.find_all("div", class_="headlocation")
        if name:
            self.name = name[0].get_text()

        mt_index = -1
        for element in soup.find_all(
            "div", {"class": ["shortmenurecipes", "shortmenumeals"]}
        ):
            meal_times = list(self.meals.keys())
            if element.get_text() in meal_times:
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
