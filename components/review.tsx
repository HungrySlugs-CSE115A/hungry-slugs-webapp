"use client";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";

export default function Review_bar({
  food_name,
  user_id,
}: {
  food_name: string;
  user_id: string;
}) {
  // post get_rating
  // const [averageRating, setAverage] = useState<string>();
  // axios
  //     .post("http://localhost:8000/myapi/average_rating/", //gets the user rating
  //         { food_item: food_name }) //need to get global

  //     .then((response) => {//get diff?
  //         setAverage(response.data)
  //         console.log(response.data);
  //     })
  //     .catch((error) => {
  //         console.log(error);
  //     });

  return <div className="flex items-center justify-center pb-4 "></div>;
}
