import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { CropRecommendation } from "@/components/CropRecommendation";
import { FarmingBackground } from "@/components/FarmingBackground";

export default function Recommendations() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <FarmingBackground />
      <Navigation hideForGuests />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CropRecommendation />
      </div>
    </div>
  );
}