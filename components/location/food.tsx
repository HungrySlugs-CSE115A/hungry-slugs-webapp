import Link from "next/link";

export default function LocationFood({
  food_name,
  restrictions,
}: {
  food_name: string;
  restrictions: string[];
}) {
  return (
    <Link href={`/foods/${encodeURIComponent(food_name)}`}>
      <div className="flex flex-row justify-between hover:border-gray-300 hover:rounded-[2px] border-white border bg-[#F9F9F9] font-medium text-gray-700 py-1 my-1 text-sm">
        <h4 className="ml-3">{food_name}</h4>
        <div className="flex flex-row mr-3">
          <ul className="flex flex-row px-1">
            {restrictions.map((restriction, l) => (
              <li key={l} className="px-1">
                {restriction}
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
