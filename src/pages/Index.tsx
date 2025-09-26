import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FarmDashboard } from "@/components/FarmDashboard";
import { AIAssistant } from "@/components/AIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Bot, Home, Settings } from "lucide-react";

const Index = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const getTabLabel = (key: string) => {
    const labels = {
      dashboard: { en: "Dashboard", hi: "डैशबोर्ड", or: "ଡ୍ୟାସବୋର୍ଡ" },
      assistant: { en: "AI Assistant", hi: "AI सहायक", or: "AI ସହାୟକ" },
    };
    return labels[key]?.[currentLanguage] || labels[key]?.en;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        isVoiceActive={isVoiceActive}
        onToggleVoice={toggleVoice}
      />
      
      {activeTab === "home" && (
        <HeroSection language={currentLanguage} />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">{getTabLabel("dashboard")}</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">{getTabLabel("assistant")}</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-8">
            <TabsContent value="home">
              <HeroSection language={currentLanguage} />
            </TabsContent>
            
            <TabsContent value="dashboard">
              <FarmDashboard />
            </TabsContent>
            
            <TabsContent value="assistant">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AIAssistant 
                  language={currentLanguage} 
                  isVoiceEnabled={isVoiceActive} 
                />
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-foreground">🗣️ Voice Features</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Click the microphone to start voice commands</li>
                      <li>• Ask questions in English, Hindi, or Odia</li>
                      <li>• Get audio responses in your preferred language</li>
                      <li>• Perfect for farmers who prefer speaking over typing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-6">
                    <h3 className="font-semibold mb-4 text-foreground">💡 Ask About</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-1">
                        <p className="font-medium">Irrigation</p>
                        <p className="font-medium">Fertilizers</p>
                        <p className="font-medium">Pest Control</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">Weather</p>
                        <p className="font-medium">Soil Health</p>
                        <p className="font-medium">Crop Selection</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
