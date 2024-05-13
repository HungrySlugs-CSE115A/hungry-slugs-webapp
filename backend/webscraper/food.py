from bs4.element import Tag


class Food:
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
        return {"name": self.name, self.name: self.allergies}
