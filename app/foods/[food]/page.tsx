"use client";
import { useEffect, useState } from "react";
import axios from "axios";

import { Food } from "@/interfaces/Food";

import Comments from "@/components/food/comments";
import Ratings from "@/components/food/ratings";
import Images from "@/components/food/images";

export default function Page({ params }: { params: { food: string } }) {
  const [tabSelected, setTabSelected] = useState(0);
  const [food, setFood] = useState<Food>({
    name: decodeURIComponent(params.food),
    restrictions: [],
    ratings: [],
    comments: [],
    images: [],
  });
  const tabs: Array<Array<string | JSX.Element>> = [
    ["Ratings", Ratings],
    ["Comments", Comments],
    ["Images", Images],
  ].map(
    (
      [category, Component]: Array<
        string | (({ food }: { food: Food }) => JSX.Element)
      >,
      i,
    ) => [
      category as string,
      (<Component key={i} food={food} />) as JSX.Element,
    ],
  );

  useEffect(() => {
    axios
      .get<Food>(
        `http://localhost:8000/api/foods/${encodeURIComponent(params.food)}/`,
      )
      .then((response) => {
        if (response.status === 200) {
          // get the food data
          setFood(response.data);
        } else {
          console.error(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [params.food]);

  return (
    <main className="flex flex-col items-center">
      <h1 className="font-normal py-4 text-2xl text-[#003C6C]">{food.name}</h1>
      <ul className="flex font-medium text-2xl text-[#003C6C] items-center justify-center pb-5">
        {tabs.map(([category, _]: Array<string | JSX.Element>, i) => (
          <li key={i} className="">
            <button
              onClick={() => setTabSelected(i)}
              className="px-10 decoration-yellow-400 underline-offset-8 decoration-[3px] text-xl"
              style={{
                textDecorationLine: tabSelected === i ? "underline" : "none",
              }}
            >
              {category as string}
            </button>
          </li>
        ))}
      </ul>
      {tabs.map(([_, element]: Array<string | JSX.Element>, i) => (
        <div key={i} className="flex flex-col items-center">
          {tabSelected === i && element}
        </div>
      ))}
    </main>
  );
}
