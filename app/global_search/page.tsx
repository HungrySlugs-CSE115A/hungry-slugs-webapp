"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Search.module.css";
import Image from "next/image";

import { Location, Food } from "@/interfaces/Location";

const BarebonesComponent = () => {
  const [dhs, setDhs] = useState<Location[]>([]);
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
    }
  );

  const [selectedShowAllergies, setSelectedShowAllergies] = useState<string[]>(
    () => {
      const storedShowAllergies = localStorage.getItem("showAllergies");
      return storedShowAllergies ? JSON.parse(storedShowAllergies) : [];
    }
  );

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/locations/")
      .then((response) => {
        const dhsData: Location[] = response.data.locations;
        setDhs(dhsData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
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
      food.name.toLowerCase().includes(searchInput.toLowerCase())
    );

    // Check if all boxes are unchecked
    const allBoxesUnchecked =
      selectedShowAllergies.length === 0 && selectedHideAllergies.length === 0;

    let finalFilteredFoods = filtered;
    if (!allBoxesUnchecked) {
      // Filter foods based on selectedShowAllergies and selectedHideAllergies
      finalFilteredFoods = filtered.filter(({ food }) => {
        const hasShowAllergy =
          selectedShowAllergies.length === 0 ||
          selectedShowAllergies.every((allergy) =>
            food.name.toLowerCase().includes(allergy.toLowerCase())
          );
        const hasHideAllergy = selectedHideAllergies.some(
          (allergy) => food.restrictions.includes(allergy.toLowerCase()) // Check if food's restrictions include the hide allergy
        );
        return hasShowAllergy && !hasHideAllergy;
      });
    }

    setNoFoodsFound(finalFilteredFoods.length === 0);
    setFilteredFoods(finalFilteredFoods);
    setShowSearchResults(true);
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
          Global Search
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
                    <Image
                      key={index}
                      src={`/images/restrictions/${restriction}.jpg`}
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
