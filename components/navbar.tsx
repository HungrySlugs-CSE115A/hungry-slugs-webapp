"use client";

export default function Navbar({ height }: { height: string }) {
    return (
        <nav className="bg-white fixed w-full  top-0 start-0  ">
            <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-2.5">
                <a className="flex items-center">
                    <span className="pl-5 self-left font-bold text-4xl text-[#003C6C]">
                        Hungry Slugs
                    </span>
                </a>

                <div className="" id="navbar-sticky">
                    <ul className="flex flex-col  md:p-0  md:flex-row md:border-0 font-medium text-2xl  pl-10  text-[#003C6C]">
                        <li>
                            {" "}
                            {/* replace the pound sign with actual link */}
                            <a href="#" className="px-4">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/global_search" className="px-4">
                                Search
                            </a>
                        </li>
                        <li>
                            <a href="/loginPage" className="pl-4 pr-5">
                                Account
                            </a>
                            {/* pr-X dicates how far off right we want.  */}
                        </li>
                        <li>
                            <a href="/search" className="pl-4 pr-5"></a>
                            {/* pr-X dicates how far off right we want.  */}
                        </li>
                    </ul>
                </div>
            </div>
            <hr className={`h-px border-0 pt-[0.15%] dark:bg-yellow-400`}></hr>
        </nav>
    );
}
