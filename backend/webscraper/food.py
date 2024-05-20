from bs4.element import Tag


class Food:

    restriction_image_map = {
        "eggs": "app/locations/Images/egg.jpg",
        "vegan": "app/locations/Images/vegan.jpg",
        "fish": "app/locations/Images/fish.jpg",
        "veggie": "app/locations/Images/veggie.jpg",
        "gluten": "app/locations/Images/gluten.jpg",
        "pork": "app/locations/Images/pork.jpg",
        "milk": "app/locations/Images/milk.jpg",
        "beef": "app/locations/Images/beef.jpg",
        "nuts": "app/locations/Images/nuts.jpg",
        "halal": "app/locations/Images/halal.jpg",
        "soy": "app/locations/Images/soy.jpg",
        "shellfish": "app/locations/Images/shellfish.jpg",
        "treenut": "app/locations/Images/treenut.jpg",
        "sesame": "app/locations/Images/sesame.jpg",
        "alcohol": "app/locations/Images/alcohol.jpg",
    }

    def __init__(self, html: Tag) -> None:
        self.name = "Error: Food name not found"
        self.allergies = []
        self._process_data(html)

    def _process_data(self, html: Tag) -> None:
        # find the food name
        name = html.find("div", class_="shortmenurecipes")
        if name:
            self.name = name.get_text(strip=True)
            for tags in html.find_all("img"):
                temp = tags["src"].replace("LegendImages/", "")
                temp = temp.replace(".gif", "")
                self.allergies.append(temp)

    def __str__(self) -> str:
        if len(self.allergies) == 0:
            return f"{self.name} --> No allergies"
        else:
            s = ", ".join([str(element) for element in self.allergies])
            return f"{self.name} --> {s}"

    def to_dict(self) -> dict:
        # foodObj = {self.name: self.allergies}
        return {
            "name": self.name,
            "restrictions": self.allergies,
            "restriction_image_map": self.restriction_image_map,
        }
