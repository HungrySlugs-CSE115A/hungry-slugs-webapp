import axios from "axios";
import Link from "next/link";

export default function LocationFood({
  food_name,
  restriction_images,
}: {
  food_name: string;
  restriction_images: string[]; // Change the type to string array
}) {

  const getuserdata = () => {

    axios
      .get("http://localhost:8000/myapi/user_rating_get")
      .then()


  };

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
          </div>
          <div>
            <h4>Rating</h4>
          </div>
        </div>
      </div>
    </Link>
  );
}
