import requests
from bs4 import BeautifulSoup

from .dining_hall import DiningHall


class FoodOptions:
    main_url = "https://nutrition.sa.ucsc.edu/"

    def __init__(self) -> None:
        self.dining_halls = self.__retrieve_data()

    def get_all_dhs(self) -> dict[str, DiningHall]:
        return self.dining_halls

    # covert each dining hall object to json
    def jsonify_dining_halls(self) -> list[dict]:
        res = []
        for dh in self.dining_halls.values():
            res.append(dh.jsonify())
        return res

    def __retrieve_data(self) -> dict[str, DiningHall]:
        try:
            response = requests.get(self.main_url, verify=False)
        except requests.exceptions.RequestException as e:  # This is the correct syntax
            raise SystemExit(e)

        html_text = response.text
        soup = BeautifulSoup(html_text, "html.parser")

        dh_urls = []

        locations = soup.find_all("li", class_="locations")
        for el in locations[:4]:
            line = el.find("a")
            dh_urls.append(self.main_url + line.get("href"))

        dhs = {}
        for dh_url in dh_urls:
            dining_hall = DiningHall(dh_url)
            dhs[dining_hall.name] = dining_hall

        return dhs

    def __str__(self) -> str:
        result = ""
        for dh in self.dining_halls.values():
            result += str(dh)
        return result

    def jsonify(self) -> dict:
        dhs = []
        for dh in self.dining_halls.values():
            dhs.append(dh.jsonify())
        result = {"Dining Halls": dhs}
        return result


if __name__ == "__main__":
    fo = FoodOptions()
    print(fo)
