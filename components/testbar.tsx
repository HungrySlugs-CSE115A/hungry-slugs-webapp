"use client";

export default function Testbar({ height }: { height: string }) {
  return (
    <nav className="bg-white fixed w-full  top-0 start-0  ">
      <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-2.5">
        <a className="flex items-center  rtl:space-x-reverse">
          <span className="self-left font-semibold text-4xl text-[#003C6C]">
            Hungry Slugs
          </span>
        </a>

        <div className="" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0   rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            <li>
              <a
                className="font-semibold text-2xl  pl-5 text-[#003C6C]"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a className="font-semibold text-2xl  pl-5  text-[#003C6C]">
                Search
              </a>
            </li>
            <li>
              <a className="font-semibold text-2xl  pl-5  text-[#003C6C]">
                Account
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className={`h-px border-0 pt-[0.15%] dark:bg-yellow-400`}></hr>
    </nav>
  );
}
