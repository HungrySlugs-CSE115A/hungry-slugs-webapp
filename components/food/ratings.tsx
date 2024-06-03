import { Food } from "@/interfaces/Food";
import { Doppio_One } from "next/font/google";

export default function Ratings({ food }: { food: Food }) {
  console.log(food);
  return (
    <div className="w-screen ">
      {" "}
      {/* Yes I know this is horribly written and inefficent -Noah*/}
      <h1 className="flex justify-center font-normal py-2 text-xl text-[#003C6C]">
        <div className="flex w-1/3 pl-5">User</div>
        <div className="flex w-3/2 ">Rating</div>
      </h1>
      <div className="flex flex-col justify-center ">
        {
          /* convert ratings obj to array and map */
          Object.entries(food.ratings).map(([user_id, rating]) => (
            <p
              key={user_id}
              className="flex flex-row justify-center pb-2  my-1 text-med"
            >
              <div className="px-5 flex w-1/3 border-white border bg-[#F9F9F9] font-medium text-[#003C6C]">
                {user_id}
              </div>
              <div className="px-5 flex w-3/2 border-white border bg-[#F9F9F9] font-medium text-gray-700">
                {rating.rating}
              </div>
            </p>
          ))
        }
      </div>
    </div>
  );
}
