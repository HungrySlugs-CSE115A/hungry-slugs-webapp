"use client";
import Link from "next/link";

function ButtonLink(props: any) {
  return (
    <div className="">
      <Link
        href={{
          pathname: `/${encodeURIComponent(props.number)}`,
          query: {
            name: props.name,
          },
        }}
      >
        {props.name}
      </Link>
    </div>
  );
}

export default function DhBar({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center pb-4 ">
      <div className="border  hover:border-black w-1/2 px-8 py-3   bg-[#F9F9F9] m4">
        <ul className="flex flex-col md:flex-row font-semibold text-2xl ">
          <li className=" text-[#00458C]">
            <ButtonLink name={name} />
          </li>
        </ul>
      </div>
    </div>
  );
}
