import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar";

const monst = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hungry Slugs",
  description: "Review foods at UCSC food locations",
  icons: {
    icon: "images/logos/UCSC-menu-logo.png",
  },
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
