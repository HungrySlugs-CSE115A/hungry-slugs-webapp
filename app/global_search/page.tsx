"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import styles from "./Search.module.css";
import { fetchLocations } from "@/app/db";
import { Location, Food } from "@/interfaces/Location";

interface FoodWithCategory {
  food: Food;
  category: string;
  diningHall: string; // Added dining hall name
}

const restrictions: string[] = [
  "eggs",
  "vegan",
  "fish",
  "veggie",
  "gluten",
  "pork",
  "milk",
  "beef",
  "nuts",
  "halal",
  "soy",
  "shellfish",
  "treenut",
  "sesame",
  "alcohol",
];

const GlobalSearch = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [foods, setFoods] = useState<FoodWithCategory[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [foundFoods, setFoundFoods] = useState<FoodWithCategory[]>([]);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState<boolean>(false);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    () => {
      const storedRestrictions = localStorage.getItem("selectedRestrictions");
      return storedRestrictions ? JSON.parse(storedRestrictions) : [];
    },
  );
  const [filterApplied, setFilterApplied] = useState<boolean>(false);

  useEffect(() => {
    fetchLocations().then((locations: Location[]) => {
      setLocations(locations);

      const allFoods = locations.flatMap((location) =>
        location.categories.flatMap((category) =>
          category.sub_categories.flatMap((subCategory) =>
            subCategory.foods.map((food) => ({
              food: food,
              category: category.name,
              diningHall: location.name, // Added dining hall name
            })),
          ),
        ),
      );
      setFoods(allFoods);
    });
  }, []);

  const searchForFood = (food_name: string) => {
    const foundFoods = foods.filter((foodWithCategory) =>
      foodWithCategory.food.name
        .toLowerCase()
        .includes(food_name.toLowerCase()),
    );

    const filteredFoods = foundFoods.filter(({ food }) =>
      selectedRestrictions.every((restriction) =>
        food.restrictions.includes(restriction),
      ),
    );

    setFoundFoods(filteredFoods);
  };

  const toggleFilterPopup = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    const newRestrictions = checked
      ? [...selectedRestrictions, restriction]
      : selectedRestrictions.filter((r) => r !== restriction);
    setSelectedRestrictions(newRestrictions);
    localStorage.setItem(
      "selectedRestrictions",
      JSON.stringify(newRestrictions),
    );
  };

  const applyFilter = () => {
    setFilterApplied(true);
    searchForFood(searchInput);
    toggleFilterPopup();
  };

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.flexCenter}>
          <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
            Global Search
          </h1>
        </div>

        <div className={styles.flexCenter}>
          <div className="search-bar flex justify-center items-center mb-2">
            <input
              type="text"
              placeholder="Search foods..."
              className="border border-gray-400 p-2 rounded"
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              onClick={() => searchForFood(searchInput)}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </div>

        <div className={styles.flexCenter}>
          <button
            onClick={toggleFilterPopup}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </div>

        {isFilterPopupOpen && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <h2 className="font-semibold text-xl mb-4">
                Filter by Restrictions
              </h2>
              <div className="flex flex-wrap">
                {restrictions.map((restriction) => (
                  <div
                    key={restriction}
                    className="flex items-center mr-4 mb-2"
                  >
                    <input
                      type="checkbox"
                      id={restriction}
                      className="mr-2"
                      checked={selectedRestrictions.includes(restriction)}
                      onChange={(e) =>
                        handleRestrictionChange(restriction, e.target.checked)
                      }
                    />
                    <label htmlFor={restriction} className="flex items-center">
                      <Image
                        src={`/images/restrictions/${restriction}.jpg`}
                        alt={restriction}
                        width={25}
                        height={25}
                      />
                      <span className="ml-1">{restriction}</span>
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={applyFilter}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply
              </button>
              <button
                onClick={toggleFilterPopup}
                className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div>
          {filterApplied && foundFoods.length === 0 ? (
            <p>No foods found with the specified allergy constraints</p>
          ) : (
            foundFoods.map((foodWithCategory, index) => (
              <div
                key={index}
                className="flex flex-row justify-between hover:border-gray-300 hover:rounded-[2px] border-white border bg-[#F9F9F9] font-medium text-gray-700 py-1 my-1 text-sm"
              >
                <Link
                  className="flex flex-row ml-3"
                  href={`/foods/${encodeURIComponent(foodWithCategory.food.name)}`}
                >
                  <h4 className="px-2">{foodWithCategory.food.name}</h4>
                  <h5 className="font-normal text-gray-400 px-2">
                    {foodWithCategory.category} @ {foodWithCategory.diningHall}{" "}
                    {/* Added dining hall name */}
                  </h5>
                </Link>
                <ul className="flex flex-row mr-3">
                  {foodWithCategory.food.restrictions.map(
                    (restriction, index) => (
                      <li key={index} className="px-2">
                        <Image
                          src={`/images/restrictions/${restriction}.jpg`}
                          alt={restriction}
                          width={25}
                          height={25}
                        />
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default GlobalSearch;
