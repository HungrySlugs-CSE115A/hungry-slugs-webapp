"use client";
import { useState, useEffect, use } from "react";
import axios from "axios";

interface Food {
  name: string;
  restrictions: Array<string>;
}

interface subCategory {
  name: string;
  foods: Array<Food>;
}

interface Category {
  name: string;
  sub_categories: Array<subCategory>;
}

interface Location {
  name: string;
  categories: Category[];
}

export default function Page({ params }: { params: { location: number } }) {
  const [location, setLocation] = useState<Location>();

  // fetch location data
  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/locations/")
      .then((response) => {
        // Fetch the locations data
        const locations: Location[] = response.data["locations"];

        // get the location data
        const location = locations[params.location];

        // Set the location
        setLocation(location);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main>
      <div className="container mx-auto">
        <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
          {location && location.name}
        </h1>
        {location && location.categories.map((category, i) => (
          <div key={i}>
            <h2>{category.name}</h2>
            {category.sub_categories.map((subCategory, j) => (
              <div key={j}>
                <h3>{subCategory.name}</h3>
                {subCategory.foods.map((food, k) => (
                  <div key={k}>
                    <h4>{food.name}</h4>
                    <ul>
                      {food.restrictions.map((restrictions, l) => (
                        // note the restrictions is an array of strings
                        // this should probably be displayed in a different way for the images
                        <li key={l}>{restrictions}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))
        }
      </div>
    </main>
  );
}
