import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-agriculture.jpg";

interface LandingHeroProps {
  language: string;
}

export function LandingHero({ language }: LandingHeroProps) {
  const { user } = useAuth();

  const getContent = () => {
    const content = {
      en: {
        title: "AI-Driven Crop Recommendation System",
        welcome: "Welcome, Guest!",
        description: "Unlock the power of AI for smarter farming. Get personalized crop recommendations, detect diseases instantly, and interact with our AI assistant—all in one platform.",
        cropButton: "Get Crop Recommendations",
        profileButton: "View Profile"
      },
      hi: {
        title: "AI संचालित फसल सुझाव सिस्टम",
        welcome: "स्वागत है, अतिथि!",
        description: "स्मार्ट कृषि के लिए AI की शक्ति को अनलॉक करें। व्यक्तिगत फसल सुझाव प्राप्त करें, तुरंत रोगों का पता लगाएं, और हमारे AI असिस्टेंट के साथ बातचीत करें—सब एक प्लेटफॉर्म में।",
        cropButton: "फसल सुझाव प्राप्त करें",
        profileButton: "प्रोफाइल देखें"
      },
      or: {
        title: "AI ଚାଳିତ ଫସଲ ସୁପାରିଶ ସିଷ୍ଟମ୍",
        welcome: "ସ୍ୱାଗତ, ଅତିଥି!",
        description: "ସ୍ମାର୍ଟ କୃଷି ପାଇଁ AI ର ଶକ୍ତି ଅନଲକ୍ କରନ୍ତୁ। ବ୍ୟକ୍ତିଗତ ଫସଲ ସୁପାରିଶ ପାଆନ୍ତୁ, ତୁରନ୍ତ ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ, ଏବଂ ଆମର AI ସହାୟକ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ—ସବୁ ଗୋଟିଏ ପ୍ଲାଟଫର୍ମରେ।",
        cropButton: "ଫସଲ ସୁପାରିଶ ପାଆନ୍ତୁ",
        profileButton: "ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ"
      },
      te: {
        title: "AI ఆధారిత పంట సిఫార్సు వ్యవస్థ",
        welcome: "స్వాగతం, అతిథి!",
        description: "తెలివైన వ్యవసాయం కోసం AI యొక్క శక్తిని అన్‌లాక్ చేయండి. వ్యక్తిగతీకరించిన పంట సిఫార్సులను పొందండి, వ్యాధులను తక్షణమే గుర్తించండి మరియు మా AI అసిస్టెంట్‌తో పరస్పర చర్య చేయండి—అన్నీ ఒక ప్లాట్‌ఫామ్‌లో।",
        cropButton: "పంట సిఫార్సులను పొందండి",
        profileButton: "ప్రొఫైల్ చూడండి"
      }
    };
    
    return content[language] || content.en;
  };

  const text = getContent();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold text-white">
                  {text.title}
                </h1>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  {text.welcome}
                </h2>
                
                <p className="text-lg text-white/90 leading-relaxed">
                  {text.description}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  asChild
                >
                  <Link to="/recommendations">
                    {text.cropButton}
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white/10 transition-colors"
                  asChild
                >
                  <Link to={user ? "/profile" : "/auth"}>
                    {text.profileButton}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}