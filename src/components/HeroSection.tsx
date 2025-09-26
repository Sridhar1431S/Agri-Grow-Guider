import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Globe, Zap } from "lucide-react";
import heroImage from "@/assets/hero-agriculture.jpg";

interface HeroSectionProps {
  language: string;
}

export function HeroSection({ language }: HeroSectionProps) {
  const getTitle = () => {
    switch (language) {
      case "hi":
        return "AI के साथ फसल उत्पादन बढ़ाएं";
      case "or":
        return "AI ସହିତ ଫସଲ ଉତ୍ପାଦନ ବୃଦ୍ଧି କରନ୍ତୁ";
      default:
        return "Boost Your Crop Yield with AI";
    }
  };

  const getSubtitle = () => {
    switch (language) {
      case "hi":
        return "स्मार्ट कृषि के साथ अपनी आय 15% तक बढ़ाएं। मौसम और मिट्टी के डेटा के साथ व्यक्तिगत सलाह पाएं।";
      case "or":
        return "ସ୍ମାର୍ଟ କୃଷି ସହିତ ଆପଣଙ୍କର ଆୟ ୧୫% ପର୍ଯ୍ୟନ୍ତ ବୃଦ୍ଧି କରନ୍ତୁ। ପାଣିପାଗ ଏବଂ ମାଟିର ତଥ୍ୟ ସହିତ ବ୍ୟକ୍ତିଗତ ସଲାହ ପାଆନ୍ତୁ।";
      default:
        return "Increase your farm income by up to 15% with smart agriculture. Get personalized advice with weather and soil data.";
    }
  };

  const getStartedText = () => {
    switch (language) {
      case "hi":
        return "शुरू करें";
      case "or":
        return "ଆରମ୍ଭ କରନ୍ତୁ";
      default:
        return "Get Started";
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-growth">
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              🌱 Smart Farming Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {getTitle()}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              {getSubtitle()}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                {getStartedText()}
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Globe className="w-4 h-4 mr-2" />
                Demo
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold">15%</div>
                <div className="text-sm text-white/80">Yield Increase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-white/80">Farmers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-white/80">Languages</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-white">
                <TrendingUp className="w-8 h-8 text-white mb-4" />
                <h3 className="font-semibold mb-2">Yield Prediction</h3>
                <p className="text-sm text-white/80">AI-powered forecasting with 87% accuracy</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-white">
                <Users className="w-8 h-8 text-white mb-4" />
                <h3 className="font-semibold mb-2">Expert Assistant</h3>
                <p className="text-sm text-white/80">24/7 farming advice in your language</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-white">
                <Globe className="w-8 h-8 text-white mb-4" />
                <h3 className="font-semibold mb-2">Weather Data</h3>
                <p className="text-sm text-white/80">Real-time local weather and soil info</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-white">
                <Zap className="w-8 h-8 text-white mb-4" />
                <h3 className="font-semibold mb-2">Voice Commands</h3>
                <p className="text-sm text-white/80">Speak in Hindi, English, or Odia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}