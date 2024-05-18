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

  // Retrieve hide and show allergies from local storage
  const [selectedHideAllergies, setSelectedHideAllergies] = useState<string[]>(() => {
    const storedHideAllergies = localStorage.getItem('hideAllergies');
    return storedHideAllergies ? JSON.parse(storedHideAllergies) : [];
  });

  const [selectedShowAllergies, setSelectedShowAllergies] = useState<string[]>(() => {
    const storedShowAllergies = localStorage.getItem('showAllergies');
    return storedShowAllergies ? JSON.parse(storedShowAllergies) : [];
  });

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/locations/")
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

  const handleFilter = () => {
    window.location.href = "Filter-Window";
  };

  const handleSearch = () => {
    const allFoods: { food: Food; dhName: string; categoryName: string }[] = [];
    dhs.forEach((dh) => {
      dh.categories.forEach((category) => {
        category.sub_categories.forEach((subCategory) => {
          subCategory.foods.forEach((food) => {
            allFoods.push({
              food,
              dhName: dh.name,
              categoryName: category.name,
            });
          });
        });
      });
    });

    const filtered = allFoods.filter(({ food }) =>
      food.name.toLowerCase().includes(searchInput.toLowerCase()),
    );

    // Filter foods based on selectedShowAllergies and selectedHideAllergies
    const finalFilteredFoods = filtered.filter(({ food }) =>
      selectedShowAllergies.every(allergy => food.name.toLowerCase().includes(allergy.toLowerCase())) &&
      !selectedHideAllergies.some(allergy => food.name.toLowerCase().includes(allergy.toLowerCase()))
    );

    setNoFoodsFound(finalFilteredFoods.length === 0);
    setFilteredFoods(finalFilteredFoods);
    setShowSearchResults(true);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Title */}
      <h1 className="text-8xl">Welcome to Hungry Slugs!</h1>
      {/* Search bar */}
      <div className="search-bar" style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search foods..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearch}>Search</button>
        {/* Filter button */}
        <div
          style={{
            display: 'inline-block',
            marginLeft: '10px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
          onClick={handleFilter}
        >
          Filter
        </div>
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

      {/* Display selected hide and show allergies */}
      <div>
        <h3>Selected Hide Allergies:</h3>
        <ul>
          {selectedHideAllergies.map((allergy, index) => (
            <li key={index}>{allergy}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Selected Show Allergies:</h3>
        <ul>
          {selectedShowAllergies.map((allergy, index) => (
            <li key={index}>{allergy}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BarebonesComponent;
