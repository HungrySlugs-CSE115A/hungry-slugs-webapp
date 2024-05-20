import { Food } from "@/interfaces/Food";

export default function Ratings({ food }: { food: Food }) {
  return (
    <div>
      <h1>{food && food.name}</h1>
      <h2>Ratings</h2>
      <div>
        <p>Rating 1</p>
        <p>Rating 2</p>
        <p>Rating 3</p>
      </div>
    </div>
  );
}
