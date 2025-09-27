import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { LandingHero } from "@/components/LandingHero";

export default function Landing() {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      <LandingHero language={currentLanguage} />
    </div>
  );
}