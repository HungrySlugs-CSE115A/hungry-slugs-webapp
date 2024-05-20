import { Food } from "@/interfaces/Food";

export default function Images({ food }: { food: Food }) {
  return (
    <div>
      <h1>{food && food.name}</h1>
      <h2>Images</h2>
      <div>Image 1</div>
    </div>
  );
}
