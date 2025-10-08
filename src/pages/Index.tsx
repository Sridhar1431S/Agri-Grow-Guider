import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { FarmDashboard } from "@/components/FarmDashboard";
import { AIAssistant } from "@/components/AIAssistant";
import { SoilAnalysis } from "@/components/SoilAnalysis";
import { CropRecommendation } from "@/components/CropRecommendation";
import { FarmingBackground } from "@/components/FarmingBackground";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Bot, Home, TestTube, Sprout } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Redirect to auth if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-growth">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const getTabLabel = (key: string) => {
    const labels = {
      dashboard: { en: "Dashboard", hi: "डैशबोर्ड", or: "ଡ୍ୟାସବୋର୍ଡ", te: "డాష్‌బోర్డ్" },
      assistant: { en: "AI Assistant", hi: "AI सहायक", or: "AI ସହାୟକ", te: "AI అసిస్టెంట్" },
      soil: { en: "Soil Analysis", hi: "मिट्टी विश्लेषण", or: "ମାଟି ବିଶ୍ଳେଷଣ", te: "నేల విశ్లేషణ" },
      crops: { en: "Crop Recommendations", hi: "फसल सुझाव", or: "ଫସଲ ସୁପାରିଶ", te: "పంట సిఫార్సులు" },
    };
    return labels[key]?.[currentLanguage] || labels[key]?.en;
  };

  return (
    <div className="min-h-screen bg-background">
      <FarmingBackground />
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{getTabLabel("dashboard")}</span>
              <span className="sm:hidden">Farm</span>
            </TabsTrigger>
            <TabsTrigger value="soil" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <TestTube className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{getTabLabel("soil")}</span>
              <span className="sm:hidden">Soil</span>
            </TabsTrigger>
            <TabsTrigger value="crops" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Sprout className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{getTabLabel("crops")}</span>
              <span className="sm:hidden">Crops</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{getTabLabel("assistant")}</span>
              <span className="sm:hidden">AI</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 sm:mt-8">
            <TabsContent value="dashboard">
              <FarmDashboard />
            </TabsContent>
            
            <TabsContent value="soil">
              <SoilAnalysis />
            </TabsContent>
            
            <TabsContent value="crops">
              <CropRecommendation />
            </TabsContent>
            
            <TabsContent value="assistant">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <AIAssistant 
                  language={currentLanguage} 
                  isVoiceEnabled={isVoiceActive} 
                />
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-muted/50 rounded-lg p-4 sm:p-6">
                    <h3 className="font-semibold mb-3 sm:mb-4 text-foreground">🗣️ Voice Features</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Click the microphone to start voice commands</li>
                      <li>• Ask questions in English, Hindi, or Odia</li>
                      <li>• Get audio responses in your preferred language</li>
                      <li>• Perfect for farmers who prefer speaking over typing</li>
                    </ul>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-4 sm:p-6">
                    <h3 className="font-semibold mb-3 sm:mb-4 text-foreground">💡 Ask About</h3>
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
