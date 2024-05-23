import axios from "axios";
import Link from "next/link";

import Rating_bar from "@/components/rating";
import Review_bar from "@/components/review";


export default function LocationFood({
  food_name,
  food_average,
  restriction_images,
}: {
  food_name: string;
  food_average: number;
  restriction_images: string[]; // Change the type to string array
}) {

  // const [user_rating, setUserRating] = useState(0);
  let user_id = sessionStorage.getItem("token");
  if (user_id == null) user_id = "";

  return (
    <Link href={`/foods/${encodeURIComponent(food_name)}`}>
      <div className="flex flex-row justify-between hover:border-gray-300 hover:rounded-[2px] border-white border bg-[#F9F9F9] font-medium text-gray-700 py-1 my-1 text-sm">
        <h4 className="ml-3">{food_name}</h4>
        <div className="flex flex-row mr-3">
          <ul className="flex flex-row px-1">
            {restriction_images.map((image, index) => (
              <li key={index} className="px-1">
                <img src={image} height={20} width={20} alt={image} />{" "}
                {/* Display the image */}
              </li>
            ))}
          </ul>
          <div>
            <h4>Review</h4>
            {food_average}
            {/* <Rating_bar food_name={food_name} user_id={'0'} /> */}
          </div>
          <div>
            <h4>Rating</h4>
            <Review_bar food_name={food_name} user_id={'0'} />
          </div>
        </div>
      </div>
    </Link>
  );
}
