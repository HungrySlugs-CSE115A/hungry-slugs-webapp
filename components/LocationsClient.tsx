"use client";

import { useState } from "react";
import { Location } from "@/interfaces/Location";
import DhBar from "@/components/dh_bar_main";

interface LocationsClientProps {
  locations: Location[];
}

export default function LocationsClient({ locations }: LocationsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredLocations = locations.filter((location) => {
    if (selectedCategory === "All") {
      return true;
    } else if (selectedCategory === "Dining Halls") {
      return location.name.toLowerCase().includes("dining hall");
    } else if (selectedCategory === "Markets") {
      return (
        location.name.toLowerCase().includes("market") ||
        location.name.toLowerCase().includes("stop")
      );
    } else if (selectedCategory === "Cafes & Other") {
      return (
        location.name.toLowerCase().includes("cafe") ||
        location.name.toLowerCase().includes("other")
      );
    }
    return true;
  });

  return (
    <div>
      <ul className="flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5">
        {[
          ["All", "#"],
          ["Dining Halls", "#"],
          ["Markets", "#"],
          ["Cafes & Other", "#"],
        ].map(([category, href], i) => (
          <li key={i} className="">
            <button
              onClick={() => handleCategoryClick(category)}
              className="px-10 hover:underline decoration-yellow-400 underline-offset-8 decoration-4"
            >
              {category}
            </button>
          </li>
        ))}
      </ul>

      <h3 className="w-full">
        <ul className="">
          {filteredLocations.map((location, i) => (
            <li key={i}>
              <DhBar name={location.name} index={i} />
            </li>
          ))}
        </ul>
      </h3>
    </div>
  );
}
