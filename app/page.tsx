"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import DhBar from "@/components/dh_bar_main";

import { Location } from "@/interfaces/Location";

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/myapi/locations/")
      .then((response) => {
        setLocations(response.data["locations"]);
        // console.log(response.data["locations"][0]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Just update the db?

  return (
    <main>
      <div>
        <h1 className="font-semibold py-5 text-4xl text-[#003C6C] flex items-center justify-center">
          Locations
        </h1>

        <ul className="flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5">
          {[
            ["Dining Halls", "#"],
            ["Markets", "#"],
            ["Cafes & Other", "#"],
          ].map(([category, href]: Array<string>, i) => (
            <li key={i} className="">
              <a
                href={href}
                className="px-10 hover:underline decoration-yellow-400 underline-offset-8 decoration-4"
              >
                {category}
              </a>
            </li>
          ))}
        </ul>

        <h3 className="w-full">
          <ul className="">
            {locations.map((location, i) => (
              <li key={i}>
                <DhBar name={location.name} index={i} />
              </li>
            ))}
          </ul>
        </h3>
      </div>
    </main>
  );
}
