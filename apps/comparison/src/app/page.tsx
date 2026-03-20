"use client";

import { useState } from "react";
import Header from "@/components/Header";

export default function Home() {
  const [activePage, setActivePage] = useState("/");

  return (
    <div>
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        onRace={() => alert("Race!")}
        raceDisabled={false}
      />
      <div className="pt-14 p-8">
        <p>Active page: {activePage}</p>
      </div>
    </div>
  );
}
