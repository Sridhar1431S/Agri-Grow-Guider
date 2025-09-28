import { Navigation } from "@/components/Navigation";
import { AIAssistant } from "@/components/AIAssistant";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Chat() {
  const { currentLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation hideForGuests />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <AIAssistant 
            language={currentLanguage} 
            isVoiceEnabled={true} 
          />
        </div>
      </div>
    </div>
  );
}