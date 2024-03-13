import "../styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "@/components/header-and-sidebar/header";
import HeaderMobile from "@/components/header-and-sidebar/header-mobile";
import MarginWidthWrapper from "@/components/header-and-sidebar/margin-width-wrapper";
import PageWrapper from "@/components/header-and-sidebar/page-wrapper";
import SideNav from "@/components/header-and-sidebar/side-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ERP System",
  description: "Created by D Harshil Kumar Reddy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-gray${inter.className}`}>
        <div className="flex">
          <SideNav />
          <main className="flex-1">
            <MarginWidthWrapper>
              <Header />
              <HeaderMobile />
              <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
          </main>
        </div>
      </body>
    </html>
  );
}
