import axios from "axios";
import Link from "next/link";

import Rating_bar from "@/components/rating";
import Review_bar from "@/components/review";
import { get } from "http";


export default function LocationFood({
  food_name,
  food_average,
  restriction_images,
}: {
  food_name: string;
  food_average: any;
  restriction_images: string[]; // Change the type to string array
}) {
  const ratings = [1, 2, 3, 4, 5];
  let user_token = sessionStorage.getItem("token");
  if (user_token == null) { user_token = "0"; }
  // const [user_rating, setUserRating] = useState(0);

  function handleRatingChange(newRating: number) {

    alert("Rating changed to " + newRating);
    axios
      .post("http://localhost:8000/myapi/rating_update/", { food_name: food_name, user_id: user_token, food_rating: newRating })
      .then((response) => {//get diff?
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  return (
    <div>

      <div className=" flex flex-row justify-between hover:border-gray-300 hover:rounded-[2px] border-white border bg-[#F9F9F9] font-medium text-gray-700 py-1 my-1 text-sm">
        <Link href={`/foods/${encodeURIComponent(food_name)}`}>
          <h4 className="ml-3">{food_name}</h4>
        </Link>
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
            <h4 className="flex justify-center ">  {food_average} </h4>

            {/* <Rating_bar food_name={food_name} user_id={'0'} /> */}
          </div>
          <div>

            <h4 className="flex justify-center">
              <form>
                <select name="rating" id="rating" onChange={(e) => handleRatingChange(parseInt(e.target.value))}>
                  <option selected>Review</option>
                  {ratings.map((rating, index) => (
                    <option className="flex justify-center" key={index} value={rating}>{rating}</option>
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
