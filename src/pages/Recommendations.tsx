import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CropRecommendation } from "@/components/CropRecommendation";

export default function Recommendations() {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CropRecommendation />
      </div>
    </div>
  );
}