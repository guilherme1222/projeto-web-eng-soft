import React, { useState } from "react";
import { Hero } from "../components/organisms/Hero";
import { FeatureSection } from "../components/organisms/FeatureSection";
import { CTASection } from "../components/organisms/CTASection";
import { Footer } from "../components/organisms/Footer";

export default function App() {
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const handleSearch = () => {
    console.log("Buscando em:", searchLocation, "na data:", searchDate);
  };

  return (
    // Cores base alteradas para Light Mode e temática verde
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-600 selection:text-white">

      <Hero
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        onSearch={handleSearch}
      />

      <FeatureSection />

      <CTASection />

      <Footer />
    </div>
  );
}
