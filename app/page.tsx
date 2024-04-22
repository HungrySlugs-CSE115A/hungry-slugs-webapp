"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import NavigationBar from './navigate_pages'; // Import NavigationBar component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

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



// Define a new component for the C9C10 page
const C9C10 = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>College Nine and Ten Menu</h1>
      {/* Add any additional content for the C9C10 page here */}
    </div>
  );
};

// Define a new component for the Cowell_Stevenson page
const Cowell_Stevenson = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Cowell and Stevenson Menu</h1>
      {/* Add any additional content for the Cowell_Stevenson page here */}
    </div>
  );
};

// Define a new component for the RCC_Oakes page
const RCC_Oakes = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Rachel Carson and Oakes Menu</h1>
      {/* Add any additional content for the RCC_Oakes page here */}
    </div>
  );
};

// Define a new component for the Crown_Merrill page
const Crown_Merrill = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Crown and Merrill Menu</h1>
      {/* Add any additional content for the Crown_Merrill page here */}
    </div>
  );
};

// Define a new component for the Porter_Kresge page
const Porter_Kresge = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Porter and Kresge Menu</h1>
      {/* Add any additional content for the Porter_Kresge page here */}
    </div>
  );
};

// Define a new component for the Global_Village page
const Global_Village = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Global Village Cafe Menu</h1>
      {/* Add any additional content for the Global_Village page here */}
    </div>
  );
};

// Define a new component for the Oakes_Cafe page
const Oakes_Cafe = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Oakes Cafe Menu</h1>
      {/* Add any additional content for the Oakes_Cafe page here */}
    </div>
  );
};

// Define a new component for the Owls_Nest page
const Owls_Nest = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Owl's Nest Cafe Menu</h1>
      {/* Add any additional content for the Owls_Nest page here */}
    </div>
  );
};

// Define a new component for the Coffee_House page
const Coffee_House = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
      <h1>Stevenson Coffee House Menu</h1>
      {/* Add any additional content for the Coffee_House page here */}
    </div>
  );
};

return (
  <Router> 
    <main>
      <NavigationBar /> {/* Render the NavigationBar */}
      <div>
        <Routes>
          <Route path="/" element={<HomeContent dhName={dh_name} meals={meals} />} />
          <Route path="/c9c10" element={<C9C10 />} />
          <Route path="/cowell_stevenson" element={<Cowell_Stevenson />} />
          <Route path="/rcc_oakes" element={<RCC_Oakes/>} />
          <Route path="/crown_merrill" element={<Crown_Merrill/>} />
          <Route path="/porter_kresge" element={<Porter_Kresge/>} />
          <Route path="/global_village" element={<Global_Village/>} />
          <Route path="/oakes_cafe" element={<Oakes_Cafe/>} />
          <Route path="/owls_nest" element={<Owls_Nest/>} />
          <Route path="/coffee_house" element={<Coffee_House/>} />
        </Routes>
      </div>
    </main>
  </Router>
);
}
