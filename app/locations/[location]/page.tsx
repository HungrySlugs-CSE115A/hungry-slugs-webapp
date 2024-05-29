import { fetchLocations, fetchFoodReviewsBulk } from "@/app/db";
import { Location } from "@/interfaces/Location";
import { FrontEndReviews } from "@/interfaces/Review";
import LocationCategories from "@/components/location/categories";
import Link from "next/link";
import { getCookies } from 'next-client-cookies/server';


interface PageProps {
  params: { location: number };
  user_id: string; // Add user_id as a prop
}

export default async function ServerComponent({ params, user_id }: PageProps) {
  const locations: Location[] = await fetchLocations();
  if (params.location < 0 || params.location >= locations.length) {
    return <h1>Location not found</h1>;
  }
  const location: Location = locations[params.location];

  const cookies = getCookies();
  const username = cookies.get("username");
  console.log("user id is: ", username);

  const food_names = location.categories.flatMap((category) =>
    category.sub_categories.flatMap((sub_category) =>
      sub_category.foods.map((food) => food.name)
    )
  );

  const foodReviews: FrontEndReviews = await fetchFoodReviewsBulk({
    food_names: food_names,
    user_id: user_id, // Use the received user_id
  });

  return (
    <main>
      <div className="container mx-auto">
        <div className="flex flex-row justify-between items-center">
          <h1 className="font-semibold py-5 text-4xl text-[#003C6C]">
            {location.name}
          </h1>
          <Link
            href={`/locations/${params.location}/DH_Search`}
            className="bg-blue-500 text-white rounded hover:bg-blue-600 px-3 py-2"
          >
            Location Search
          </Link>
        </div>
        <LocationCategories location={location} reviews={foodReviews} />
      </div>
    </main>
  );
}
