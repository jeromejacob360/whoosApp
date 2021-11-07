import React from "react";
import Contacts from "./Contacts";
import Header from "./Header";
import Search from "./Search";

export default function Left() {
  return (
    <div className="border-l border-r border-main w-96 bg-main">
      <Header />
      <Search />
      <Contacts />
    </div>
  );
}
