import { Navigation } from "@/components/Navigation";
import { AdvancedAIAssistant } from "@/components/AdvancedAIAssistant";
import { FarmingBackground } from "@/components/FarmingBackground";

export default function Chat() {
  return (
    <div className="min-h-screen bg-background">
      <FarmingBackground />
      <Navigation hideForGuests />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdvancedAIAssistant />
      </div>
    </div>
  );
}