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
    <header className="flex flex-col w-full justify-center">
      <div className="flex flex-grow w-full">
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="From"
        />

        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="To"
        />

        <input
          type="text"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          placeholder="Cost per Km"
        />
      </div>

      <div>
        <button onClick={handleSubmit}>Buscar</button>
      </div>
    </header>
  );
}
