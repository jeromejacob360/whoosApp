import React from "react";

export default function Search() {
  return (
    <div className="bg-main">
      <label
        className="flex p-2 pl-4 border rounded-full border-main"
        htmlFor="input"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 pl-3 bg-white rounded-l-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          className="w-full pl-4 rounded-r-full outline-none"
          type="text"
          placeholder="Search or start a new chat"
        />
      </label>
    </div>
  );
}
