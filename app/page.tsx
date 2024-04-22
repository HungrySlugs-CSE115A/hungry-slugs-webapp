"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link"
import React from 'react';

interface Meals {
  "Breakfast": Array<string>;
  "Lunch": Array<string>;
  "Dinner": Array<string>;
  "Late Night": Array<string>;
}

interface DiningHall {
  name: string;
  meals: Meals;

}


function ButtonLink(props: any) {
  return (
    <div className="underline text-blue-600">
      <Link href={{
        pathname: `/${encodeURIComponent(props.number)}`,
        query: {
          name: props.name
        }
      }}>{props.button_name}</Link>
    </div>
  );
}


// Define HomeContentProps type
type HomeContentProps = {
  dhName: string;
  meals: string[];
};

// Define HomeContent component with explicit types
const HomeContent: React.FC<HomeContentProps> = ({ dhName, meals }) => (
  <>
    <h1 className="text-8xl">Welcome to Hungry Slugs!</h1>
    <h2 className="text-xl">name: {dhName}</h2>
    <p>Breakfast Meals:</p>
    <ul>
      {meals.map((meal, i) => (
        <li key={i}>{meal}</li>
      ))}
    </ul>
  </>
);

export default function Home() {
  const [dhs_names, set_dhs] = useState([]);
  const [dh_name, set_dh_name] = useState("");
  const [meals, set_meals] = useState([]);


  <button id="myButton" className="float-left submit-button" >Home</button>


  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        const dhs: Array<DiningHall> = response.data["Dining Halls"];
        const result: string[] = [];
        dhs.forEach((value: DiningHall, index: number) => {
          result.push(dhs[index].name);
        })
        set_dhs(result);
        const a_dh = dhs[0];
        set_dh_name(a_dh["name"]);
        const meal_time = a_dh["meals"];
        const breakfast = meal_time["Breakfast"];

        set_meals(breakfast);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <main>
      <div>
        <h1 className="text-8xl">Welcome to Hungry Slugs!</h1>

        <ul>

          {dhs_names.map((meal, i) => (
            <li>
              <ButtonLink button_name={dhs_names[i]} name={dhs_names[i]} />
            </li>
          ))}

        </ul>

        {/* <h2 className="text-xl">name: {dh_name}</h2> //this was the old means of displaying meals
        <p>Breakfast Meals:</p>                          // a version of it exists in the dh_choice page
        <ul>
          {meals.map((meal, i) => (
            <li key={meal[i]}>{meal}</li>
          ))}
        </ul> */}
      </div>
    </main>
);
}
