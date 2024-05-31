"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Search.module.css";
import Image from "next/image";
import { Location, Food } from "@/interfaces/Location";




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
  categories: Array<Category>;
}

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

const BarebonesComponent = () => {
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
        const dhsData: DiningHall[] = response.data.locations;
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
        const hasHideAllergy = selectedHideAllergies.some((allergy) =>
          food.restrictions.includes(allergy.toLowerCase())
        );
        return hasShowAllergy && !hasHideAllergy;
      });
    }

    setNoFoodsFound(finalFilteredFoods.length === 0);
    setFilteredFoods(finalFilteredFoods);
    setShowSearchResults(true);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Global Search</h2>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search foods..."
          value={searchInput}
          onChange={handleSearchInputChange}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
        <div className={styles.filterButton} onClick={handleFilter}>
          Filter
        </div>
      </div>

      {showSearchResults && (
        <div className={styles.results}>
          <h3>Search Results:</h3>
          <ul className={styles.resultList}>
            {filteredFoods.map(({ food, dhName, categoryName }, index) => (
              <li key={index} className={styles.resultItem}>
                {food.name} - {categoryName} ({dhName})
                <div className={styles.restrictionIcons}>
                  {food.restrictions.map((restriction, index) => (
                    <Image
                      key={index}
                      src={restrictionImageMap[restriction]}
                      alt={restriction}
                      width={25}
                      height={25}
                      className={styles.restrictionIcon}
                    />
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {noFoodsFound && (
        <div className={styles.noResults}>
          <h3>No foods found.</h3>
        </div>
      )}
    </div>
  );
};

export default BarebonesComponent;
