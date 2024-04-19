"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from './navigate_pages'; // Import NavigationBar component
import { BrowserRouter as Router} from 'react-router-dom';

export default function Home() {
  const [dh_name, set_dh_name] = useState("");
  const [meals, set_meals] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/dining-halls/")
      .then((response) => {
        const dhs = response.data["Dining Halls"];
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
    <Router> 
      <main>
        <NavigationBar /> {/* Render the NavigationBar component */}
        <div>
          <h1 className="text-8xl">Welcome to Hungry Slugs!</h1>
          <h2 className="text-xl">name: {dh_name}</h2>
          <p>Breakfast Meals:</p>
          <ul>
            {meals.map((meal, i) => (
              <li key={meal[i]}>{meal}</li>
            ))}
          </ul>
        </div>
      </main>
    </Router>
  );
}
