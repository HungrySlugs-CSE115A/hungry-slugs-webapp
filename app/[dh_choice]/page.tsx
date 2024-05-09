"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./accordian.css";
import Link from "next/link";

interface Food {
  name: string;
  allergies: Array<string>;
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

function name_to_dh_index(dhName: string, dhArray: DiningHall[]) {
  for (let i = 0; i < dhArray.length; i++) {
    if (dhArray[i].name === dhName) {
      return i;
    }
  }
  return -1;
}

function Accordion({ category, isOpen }) {
  const [isOpenState, setIsOpenState] = useState(isOpen);

  useEffect(() => {
    setIsOpenState(isOpen);
  }, [isOpen]);

  return (
    <div className="accordion border border-gray-200 rounded mb-2">
      <button
        className="accordion-button w-full text-left p-3 focus:outline-none"
        onClick={() => setIsOpenState(!isOpenState)}
      >
        {category.name}
        <span className="float-right">{isOpenState ? "▲" : "▼"}</span>
      </button>
      {isOpenState && (
        <div className="accordion-collapse p-3">
          {category.sub_categories.map((sub_category, j) => (
            <div key={j} className="mb-2">
              <h4 className="sub-category">{sub_category.name}</h4>
              <ul className="pl-4">
                {sub_category.foods.map((food, k) => (
                  <li key={k} className="food-item">
                    {food.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page({ searchParams }) {
  const [categories, set_categories] = useState<Category[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [noFoodsFound, setNoFoodsFound] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/locations/")
      .then((response) => {
        const dhs = response.data.locations;
        const dh_index = name_to_dh_index(searchParams.name, dhs);
        if (dh_index === -1) {
          alert("Dining hall not found");
          return;
        }
        const a_dh = dhs[dh_index];
        set_categories(a_dh.categories);
        if (Object.keys(a_dh.categories).length === 0) {
          alert("No food categories found");
          return;
        }
        const timeOfDay = getTimeOfDay();
        const timeIndex = a_dh.categories.findIndex(
          (category) => category.name.toLowerCase() === timeOfDay,
        );
        if (timeIndex !== -1) {
          setExpandedCategory(timeIndex);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.log(categories);

  useEffect(() => {
    const timeOfDay = getTimeOfDay();
    const timeIndex = categories.findIndex(
      (category) => category.name.toLowerCase() === timeOfDay,
    );
    if (timeIndex !== -1) {
      setExpandedCategory(timeIndex);
    }
  }, [categories]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchInput(event.target.value);
  };

  function handleSearch() {
    const dhChoice = searchParams.name;
    const searchResultPageUrl = `/search?diningHall=${encodeURIComponent(searchParams.name)}`;
    // Navigate to the search result page
    window.location.href = searchResultPageUrl;
    localStorage.setItem("diningHall", dhChoice);
  }

  function getTimeOfDay(): string {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour >= 7 && currentHour < 11) {
      return "breakfast";
    } else if (currentHour >= 11 && currentHour < 16) {
      return "lunch";
    } else if (currentHour >= 16 && currentHour < 19) {
      return "dinner";
    } else {
      return "late night";
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <main>

      <div className="container mx-auto">
        <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
          {searchParams.name}
        </h1>






        {/* Search button */}
        <div>
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Categories */}
        {categories.map((category, i) => (
          <div key={i}>
            <Accordion
              category={category}
              isOpen={expandedCategory === i}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
