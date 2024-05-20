import React from "react";
import Header from "./Header";
import { BreadCrumb } from "./BreadCrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-col items-start justify-start h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-black/70">
        <BreadCrumb />
        {children}
      </div>
    </>
  );
}
