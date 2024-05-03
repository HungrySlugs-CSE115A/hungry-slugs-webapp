import requests
from bs4 import BeautifulSoup

from dining_hall import DiningHall

from private.private_settings import UCSC_SSL_CERT


class FoodLocations:
    main_url = "https://nutrition.sa.ucsc.edu/"

    def __init__(self) -> None:
        self.locations: list[DiningHall] = self.__retrieve_data()

    def get_dining_halls(self) -> list[DiningHall]:
        return self.locations

    def __retrieve_data(self) -> list[DiningHall]:
        try:
            page = requests.get(self.main_url, verify=UCSC_SSL_CERT)
        except requests.exceptions.RequestException as e:  # This is the correct syntax
            raise SystemExit(e)

        # create a BS4 object by parsing the html content
        soup = BeautifulSoup(page.content, "html.parser")

        # get all the dining hall urls
        locations = soup.find_all("li", class_="locations")

        # create a list of urls
        urls = []
        for location in locations:
            line = location.find("a")
            urls.append(self.main_url + line.get("href"))  # extracts all urls

        # create a DiningHall object for each url
        dhs = []
        for url in urls:
            dh = DiningHall(url)
            dhs.append(dh)

        return dhs

    def __str__(self) -> str:
        result = ""
        for i in range(len(self.locations)):
            # add the location to the result
            result += str(self.locations[i])

            # add a newline if it's not the last location
            if i < len(self.locations) - 1:
                result += "\n"
        return result


if __name__ == "__main__":
    fo = FoodLocations()
    print(fo)
