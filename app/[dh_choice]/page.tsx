"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import './accordian.css';


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
  categories: Category;
}

function name_to_dh_index(dhName: string, dhArray: Array<DiningHall>) {
  for (let i = 0; i < dhArray.length; i++) {
    if (dhArray[i].name === dhName) {
      return i;
    }
  }
  return -1;
}

function Accordion({ category, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion border border-gray-200 rounded mb-2">
      <button
        className="accordion-button w-full text-left p-3 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {category.name}
        <span className="float-right">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && (
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
  const [categories, set_categories] = useState([]);

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
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main>
      <div className="container mx-auto">
        <h2 className="text-2xl mb-4">{searchParams.name}</h2>
        {categories.map((category, i) => (
          <div key={i}>
            {/* <h3 className="text-lg">{category.name}</h3> */}
            <div>
              <Accordion category={category} index={i} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}