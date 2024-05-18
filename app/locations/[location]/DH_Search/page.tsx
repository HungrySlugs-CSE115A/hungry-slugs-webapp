"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const HelloWorld: React.FC = () => {
  const [diningHall, setDiningHall] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    // Retrieve the dining hall name from localStorage
    const storedDiningHall = localStorage.getItem("diningHall");
    setDiningHall(storedDiningHall);
  }, []);

  const handleSearch = () => {
    axios
      .get("http://localhost:8000/myapi/locations/")
      .then((response) => {
        const dhsData = response.data.locations;
        // Find the current dining hall
        const currentDiningHall = dhsData.find((dh: any) =>
          dh.name.toLowerCase().includes(diningHall?.toLowerCase() ?? "")
        );
        if (currentDiningHall) {
          // Filter the foods based on search input
          const filteredFoods = currentDiningHall.categories.flatMap(
            (category: any) => {
              if (category.name.toLowerCase() === "breakfast") {
                return category.sub_categories.flatMap((subCategory: any) =>
                  subCategory.foods.filter((food: any) =>
                    food.name.toLowerCase().includes(searchInput.toLowerCase())
                  ).map((food: any) => ({ ...food, categoryName: "Breakfast" }))
                );
              } else {
                return category.sub_categories.flatMap((subCategory: any) =>
                  subCategory.foods.filter((food: any) =>
                    food.name.toLowerCase().includes(searchInput.toLowerCase())
                  ).map((food: any) => ({ ...food, categoryName: category.name }))
                );
              }
            }
          );
          setSearchResults(filteredFoods);
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
                {food.name} - {food.categoryName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HelloWorld;
