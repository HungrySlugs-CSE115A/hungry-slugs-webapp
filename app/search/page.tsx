"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Food {
  name: string;
}

interface subCategory {
  name: string;
  foods: Array<Food>;
}

interface Category {
  name: string;
  sub_categories: Array<subCategory>;
}

interface DiningHall {
  name: string;
  categories: Category[];
}

const BarebonesComponent = () => {
  const [dhs, setDhs] = useState<DiningHall[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredFoods, setFilteredFoods] = useState<
    { food: Food; dhName: string; categoryName: string }[]
  >([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [noFoodsFound, setNoFoodsFound] = useState<boolean>(false);

  const diningHall = localStorage.getItem("diningHall");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/locations/")
      .then((response) => {
        const dhsData: DiningHall[] = response.data.locations;
        setDhs(dhsData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = () => {
    const currentDiningHall = dhs.find((dh) => dh.name === diningHall);
    if (!currentDiningHall) return;

    const allFoods: { food: Food; dhName: string; categoryName: string }[] = [];
    currentDiningHall.categories.forEach((category) => {
      category.sub_categories.forEach((subCategory) => {
        subCategory.foods.forEach((food) => {
          allFoods.push({
            food,
            dhName: currentDiningHall.name,
            categoryName: category.name,
          });
        });
      });
    });

    const filtered = allFoods.filter(({ food }) =>
      food.name.toLowerCase().includes(searchInput.toLowerCase()),
    );

    setNoFoodsFound(filtered.length === 0);
    setFilteredFoods(filtered);
    setShowSearchResults(true);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Dining Hall Name */}
      <h2 style={{ fontSize: "60px", marginBottom: "20px" }}>
        {diningHall} Search
      </h2>

      {/* Search bar */}
      <div className="search-bar" style={{ marginTop: "20px" }}>
        {" "}
        {/* Adjust margin as needed */}
        <input
          type="text"
          placeholder="Search foods..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Display search results if button clicked */}
      {showSearchResults && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {filteredFoods.map(({ food, dhName, categoryName }, index) => (
              <li key={index}>
                {food.name} - {categoryName} ({dhName})
              </li>
            ))}
          </ul>
        </div>
      )}

      {noFoodsFound && (
        <div>
          <h3>No foods found at this dining hall.</h3>
        </div>
      )}
    </div>
  );
};

export default BarebonesComponent;
