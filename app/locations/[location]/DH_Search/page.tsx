"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../Search.module.css";
import Image from "next/image";

// Define the Food interface
interface Food {
  name: string;
  restrictions: string[];
}

// Define the subCategory interface
interface subCategory {
  name: string;
  foods: Array<Food>;
}

// Define the Category interface
interface Category {
  name: string;
  sub_categories: Array<subCategory>;
}

// Define the DiningHall interface
interface DiningHall {
  name: string;
  categories: Array<Category>;
}

// Map of restriction images
const restrictionImageMap: { [key: string]: string } = {
  eggs: "/Images/egg.jpg",
  vegan: "/Images/vegan.jpg",
  fish: "/Images/fish.jpg",
  veggie: "/Images/veggie.jpg",
  gluten: "/Images/gluten.jpg",
  pork: "/Images/pork.jpg",
  milk: "/Images/milk.jpg",
  beef: "/Images/beef.jpg",
  nuts: "/Images/nuts.jpg",
  halal: "/Images/halal.jpg",
  soy: "/Images/soy.jpg",
  shellfish: "/Images/shellfish.jpg",
  treenut: "/Images/treenut.jpg",
  sesame: "/Images/sesame.jpg",
  alcohol: "/Images/alcohol.jpg",
};

const HelloWorld: React.FC = () => {
  const [filteredFoods, setFilteredFoods] = useState<
    { food: Food; dhName: string; categoryName: string }[]
  >([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [noFoodsFound, setNoFoodsFound] = useState<boolean>(false);
  const [diningHall, setDiningHall] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Retrieve the dining hall name from localStorage when the component mounts
  useEffect(() => {
    const storedDiningHall = localStorage.getItem("diningHall");
    setDiningHall(storedDiningHall);
  }, []);

  // Handle search logic
  const handleSearch = () => {
    const currentDiningHallName = localStorage.getItem("diningHall");

    // Filter the dining halls to find the current one
    const currentDiningHall = dhs.find(
      (dh) => dh.name === currentDiningHallName,
    );

    if (currentDiningHall) {
      const allFoods: { food: Food; dhName: string; categoryName: string }[] =
        [];

      // Collect all foods from the current dining hall only
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

      // Filter the collected foods based on the search input
      const filtered = allFoods.filter(({ food }) =>
        food.name.toLowerCase().includes(searchInput.toLowerCase()),
      );

      // Check if all boxes are unchecked
      const allBoxesUnchecked =
        selectedShowAllergies.length === 0 &&
        selectedHideAllergies.length === 0;

      let finalFilteredFoods = filtered;
      if (!allBoxesUnchecked) {
        // Filter foods based on selectedShowAllergies and selectedHideAllergies
        finalFilteredFoods = filtered.filter(({ food }) => {
          const hasShowAllergy =
            selectedShowAllergies.length === 0 ||
            selectedShowAllergies.every((allergy) =>
              food.name.toLowerCase().includes(allergy.toLowerCase()),
            );
          const hasHideAllergy = selectedHideAllergies.some(
            (allergy) => food.restrictions.includes(allergy.toLowerCase()), // Check if food's restrictions include the hide allergy
          );
          return hasShowAllergy && !hasHideAllergy;
        });
      }

      // Update the state based on the search results
      setNoFoodsFound(finalFilteredFoods.length === 0);
      setFilteredFoods(finalFilteredFoods);
      setShowSearchResults(true);
    } else {
      // Handle case where the current dining hall is not found
      setFilteredFoods([]);
      setShowSearchResults(false);
      setNoFoodsFound(true);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
        {diningHall ? diningHall : "Dining Hall not found"}
      </h1>
      <div className="search-bar flex justify-center items-center mb-5">
        <input
          type="text"
          placeholder="Search dining halls..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border border-gray-400 p-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>{searchResults[0].categoryName}:</h2>
          <ul>
            {searchResults.map((food: any, index: number) => (
              <li key={index}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>
                    {food.name} - {food.categoryName} ({diningHall})
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "nowrap",
                      marginLeft: "10px",
                    }}
                  >
                    {food.restrictions.map(
                      (restriction: string, index: number) => (
                        <Image
                          key={index}
                          src={restrictionImageMap[restriction]}
                          alt={restriction}
                          style={{
                            width: "25px",
                            height: "25px",
                            margin: "5px",
                          }}
                        />
                      ),
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const BarebonesComponent: React.FC = () => {
  const [dhs, setDhs] = useState<DiningHall[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredFoods, setFilteredFoods] = useState<
    { food: Food; dhName: string; categoryName: string }[]
  >([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [noFoodsFound, setNoFoodsFound] = useState<boolean>(false);

  // Retrieve hide and show allergies from local storage
  const [selectedHideAllergies, setSelectedHideAllergies] = useState<string[]>(
    () => {
      const storedHideAllergies = localStorage.getItem("hideAllergies");
      return storedHideAllergies ? JSON.parse(storedHideAllergies) : [];
    },
  );

  const [selectedShowAllergies, setSelectedShowAllergies] = useState<string[]>(
    () => {
      const storedShowAllergies = localStorage.getItem("showAllergies");
      return storedShowAllergies ? JSON.parse(storedShowAllergies) : [];
    },
  );

  // Fetch dining hall data from the API when the component mounts
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

  // Handle search input change
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchInput(event.target.value);
  };

  // Handle filter button click
  const handleFilter = () => {
    window.location.href = "Filter-Window";
  };

  // Handle search logic
  const handleSearch = () => {
    const currentDiningHallName = localStorage.getItem("diningHall");

    // Filter the dining halls to find the current one
    const currentDiningHall = dhs.find(
      (dh) => dh.name === currentDiningHallName,
    );

    if (currentDiningHall) {
      const allFoods: { food: Food; dhName: string; categoryName: string }[] =
        [];

      // Collect all foods from the current dining hall only
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

      // Filter the collected foods based on the search input
      const filtered = allFoods.filter(({ food }) =>
        food.name.toLowerCase().includes(searchInput.toLowerCase()),
      );

      // Check if all boxes are unchecked
      const allBoxesUnchecked =
        selectedShowAllergies.length === 0 &&
        selectedHideAllergies.length === 0;

      let finalFilteredFoods = filtered;
      if (!allBoxesUnchecked) {
        // Filter foods based on selectedShowAllergies and selectedHideAllergies
        finalFilteredFoods = filtered.filter(({ food }) => {
          const hasShowAllergy =
            selectedShowAllergies.length === 0 ||
            selectedShowAllergies.every((allergy) =>
              food.name.toLowerCase().includes(allergy.toLowerCase()),
            );
          const hasHideAllergy = selectedHideAllergies.some(
            (allergy) => food.restrictions.includes(allergy.toLowerCase()), // Check if food's restrictions include the hide allergy
          );
          return hasShowAllergy && !hasHideAllergy;
        });
      }

      // Update the state based on the search results
      setNoFoodsFound(finalFilteredFoods.length === 0);
      setFilteredFoods(finalFilteredFoods);
      setShowSearchResults(true);
    } else {
      // Handle case where the current dining hall is not found
      setFilteredFoods([]);
      setShowSearchResults(false);
      setNoFoodsFound(true);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Title and Search bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 className={`${styles.filterText} ${styles.filterTopLeft}`}>
          {localStorage.getItem("diningHall")}
        </h1>

        <div
          className="search-bar"
          style={{ marginTop: "100px", display: "flex", alignItems: "center" }}
        >
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
              marginLeft: "10px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
              borderRadius: "5px",
            }}
            onClick={handleFilter}
          >
            Filter
          </div>
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
                <div style={{ display: "flex", flexWrap: "nowrap" }}>
                  {food.restrictions.map((restriction, index) => (
                    <img
                      key={index}
                      src={restrictionImageMap[restriction]}
                      alt={restriction}
                      style={{ width: "25px", height: "25px", margin: "5px" }}
                    />
                  ))}
                </div>
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
