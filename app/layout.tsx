import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
//import Link from "next/link";

import Navbar from "@/components/navbar";
import Testbar from "@/components/testbar";

const monst = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};



// This is the height of the navbar which will also be used to set the padding-top of the main content
// NOTE: you should modify this value to match the height of the navbar
const navbarHeight: string = "60px";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={monst.className}>
        <Navbar height={navbarHeight} />
        <div className="" style={{ paddingTop: navbarHeight }}>
          
          {children}
        </div>

      </body>

    </html>
  );
}
