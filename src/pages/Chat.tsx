import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { AIAssistant } from "@/components/AIAssistant";

export default function Chat() {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <AIAssistant 
            language={currentLanguage} 
            isVoiceEnabled={false} 
          />
        </div>
      </div>
    </div>
  );
}