"use server";

import { fetchLocations } from "@/app/requests";
import LocationsClient from "@/components/LocationsClient";
import { Location } from "@/interfaces/Location";

export default async function Home() {
  const locations: Location[] = await fetchLocations();

  return (
    <main>
      <div>
        <h1 className="font-semibold py-5 text-4xl text-[#003C6C] flex items-center justify-center">
          Locations
        </h1>
        <LocationsClient locations={locations} />
      </div>
    </main>
  );
}
