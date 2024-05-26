"use client";
import { useState } from "react";

export default function Nav() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = async () => {
    const data = {
      from,
      to,
      cost,
    };
  };

  return (
    <header className="flex flex-col w-full justify-center items-center gap-0 border rounded-3xl p-5 border-gray-500 m-5 bg-gray-50">
      <div className="flex flex-row justify-between w-full p-10 ">
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From"
          className="border bg-gray-50 border-gray-500 rounded-3xl p-2 shadow-inner"
        />

        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
          className="border bg-gray-50 border-gray-500 rounded-3xl p-2 shadow-inner"
        />

        <input
          type="text"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost per Km"
          className="border bg-gray-50 border-gray-500 rounded-3xl p-2 shadow-inner"
        />
      </div>

      <div>
        <button
          onClick={handleSubmit}
          className="flex p-5 bg-gray-300 rounded-xl hover:bg-gray-600 hover:text-gray-200"
        >
          Buscar
        </button>
      </div>
    </header>
  );
}
