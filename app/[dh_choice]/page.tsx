"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './accordian.css';
import Link from "next/link";


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

function name_to_dh_index(dhName: string, dhArray: DiningHall[]) {
  for (let i = 0; i < dhArray.length; i++) {
    if (dhArray[i].name === dhName) {
      return i;
    }
  }
  return -1;
}

function Accordion({ category, index, isOpen }) {
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
        <span className="float-right">
          {isOpenState ? "▲" : "▼"}
        </span>
      </button>
      {isOpenState && (
        <div className="accordion-collapse p-3">
          {category.sub_categories.map((sub_category, j) => (
            <div key={j} className="mb-2">
              <h4 className="sub-category">{sub_category.name}</h4>
              <ul className="pl-4">
                {sub_category.foods.map((food, k) => (
                  <li key={k} className="food-item">{food.name}</li>
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
  const [searchInput, setSearchInput] = useState('');
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [noFoodsFound, setNoFoodsFound] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
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
        const timeIndex = a_dh.categories.findIndex(category => category.name.toLowerCase() === timeOfDay);
        if (timeIndex !== -1) {
          setExpandedCategory(timeIndex);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const timeOfDay = getTimeOfDay(); 
    const timeIndex = categories.findIndex(category => category.name.toLowerCase() === timeOfDay);
    if (timeIndex !== -1) {
      setExpandedCategory(timeIndex);
    }
  }, [categories]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  // const handleSearch = () => {
  //   const dhChoice = searchParams.name;
  //   const searchResultPageUrl = `/SearchResultPage`;
  //   // Navigate to the search result page
    
  //   const allFoods: Food[] = categories.reduce((accumulator: Food[], currentCategory: Category) => {
  //     return accumulator.concat(currentCategory.sub_categories.flatMap(subCategory => subCategory.foods));
  //   }, []);
  
  //   const filtered = allFoods
  //     .filter(food => food.name.toLowerCase().includes(searchInput.toLowerCase()))
  //     .filter((value, index, self) => {
  //       return self.findIndex(f => f.name === value.name) === index;
  //     });
  
  //   setFilteredFoods(filtered);
  //   setNoFoodsFound(filtered.length === 0);
  //   if (filtered.length > 0) {
  //     const timeOfDay = getTimeOfDay(); 
  //     const timeIndex = categories.findIndex(category => category.name.toLowerCase() === timeOfDay);
  //     if (timeIndex !== -1) {
  //       setExpandedCategory(timeIndex);
  //     }
  //   }
  // };

  function handleSearch() {
      const dhChoice = searchParams.name;
      const searchResultPageUrl = `/search?diningHall=${encodeURIComponent(searchParams.name)}`;
    // Navigate to the search result page
    window.location.href = searchResultPageUrl;

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

  const toggleSearchActive = () => {
    setSearchActive(!searchActive);
  };

  function getCategoryName(food: Food): string {
    for (const category of categories) {
      for (const subcategory of category.sub_categories) {
        if (subcategory.foods.some(f => f.name === food.name)) {
          return category.name;
        }
      }
    }
    return "";
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
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
        <h2 className="text-2xl mb-4">{searchParams.name}</h2>
        
        {/* Search bar */}
        <div className={`search-bar ${searchActive ? 'active' : ''}`} ref={searchRef}>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchInput}
            onChange={handleSearchInputChange}
            onClick={toggleSearchActive}
            
          />
          <button onClick={handleSearch}>Search</button>
          
        </div>
        
        {/* Search results */}
        {filteredFoods.length > 0 && (
          <div>
            <h3>Search Results:</h3>
            <ul>
              {filteredFoods.map((food, index) => (
                <li key={index}>{food.name} - {getCategoryName(food)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* No foods found message */}
        {noFoodsFound && (
          <div>
            <h3>No foods found at this dining hall.</h3>
          </div>
        )}
        
        {/* Categories */}
        {categories.map((category, i) => (
          <div key={i}>
            <Accordion category={category} index={i} isOpen={expandedCategory === i} />
          </div>
        ))}
      </div>
    </main>
  );
}