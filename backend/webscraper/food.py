from bs4.element import Tag


class Food:
    def __init__(self, html: Tag) -> None:
        self.name = "Error: Food name not found"
        self.__process_data(html)

    def __process_data(self, html: Tag) -> None:
        # find the food name
        name = html.find("div", class_="shortmenurecipes")
        if name:
            self.name = name.get_text(strip=True)

    def __str__(self) -> str:
        return self.name

    def to_dict(self) -> dict:
        return {"name": self.name}
