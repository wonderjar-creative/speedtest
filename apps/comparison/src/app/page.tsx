"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

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
      <div className="pt-14">
        <Hero />
        <div className="p-8">
          <p>Active page: {activePage}</p>
        </div>
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
