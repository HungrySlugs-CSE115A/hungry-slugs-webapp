"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { updateReview } from "@/app/db";

export default function LocationFood({
  food_name,
  food_average,
  user_rating,
  restrictions,
  user_id,
}: {
  food_name: string;
  food_average: number | null;
  user_rating: number | null;
  restrictions: string[];
  user_id: string;
}) {
  const ratings = [1, 2, 3, 4, 5];
  const [average, setAverage] = useState(food_average);

  return (
    <div>
      <div className=" flex flex-row justify-between hover:border-gray-300 hover:rounded-[2px] border-white border bg-[#F9F9F9] font-medium text-gray-700 py-1 my-1 text-sm">
        <Link href={`/foods/${encodeURIComponent(food_name)}`}>
          <h4 className="ml-3">{food_name}</h4>
        </Link>
        <div className="flex flex-row mr-3">
          <ul className="flex flex-row px-1">
            {restrictions.map((image_name, index) => (
              <li key={index} className="px-1">
                <Image
                  src={`/images/restrictions/${image_name}.jpg`}
                  height={20}
                  width={20}
                  alt={image_name}
                />
                {/* Display the image */}
              </li>
            ))}
          </ul>

          <div>
            <h4 className="flex justify-center"> {average ? average : "?"} </h4>
          </div>
          <div>
            <h4 className="flex justify-center">
              <form>
                <select
                  name="rating"
                  id="rating"
                  onChange={(e) =>
                    updateReview({
                      food_name: food_name,
                      user_id: user_id,
                      food_rating: parseInt(e.target.value),
                    }).then((data) => {
                      const newAverage = data.average;
                      setAverage(newAverage);
                    })
                  }
                >
                  <option value={user_rating ? user_rating : 5}>
                    {user_rating ? user_rating : "Rate"}
                  </option>
                  {ratings.map((rating, index) => (
                    <option
                      className="flex justify-center"
                      key={index}
                      value={rating}
                    >
                      {rating}
                    </option>
                  ))}
                </select>
              </form>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
