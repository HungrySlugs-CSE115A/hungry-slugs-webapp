from bs4.element import ResultSet

class Food:
    def __init__(self, html: ResultSet) -> None:
        self.name = "Error: Food name not found"
        self.__process_data(html)
    
    def __process_data(self, html: ResultSet) -> None:
        # find the food name
        name = html.find("div", class_="shortmenurecipes")
        if name:
            self.name = name.get_text(strip=True)