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
        title: "Agri Grow",
        welcome: "AI-Powered Smart Farming Platform",
        description: "Transform your farming with AI-driven insights. Get personalized crop recommendations, detect diseases instantly, monitor weather patterns, and chat with our intelligent farming assistant.",
        getStarted: "Get Started",
        viewProfile: "View Profile"
      },
      hi: {
        title: "एग्री ग्रो",
        welcome: "AI संचालित स्मार्ट कृषि प्लेटफॉर्म",
        description: "AI-संचालित अंतर्दृष्टि के साथ अपनी कृषि को बदलें। व्यक्तिगत फसल सुझाव प्राप्त करें, तुरंत रोगों का पता लगाएं, मौसम पैटर्न की निगरानी करें, और हमारे बुद्धिमान कृषि सहायक के साथ चैट करें।",
        getStarted: "शुरू करें",
        viewProfile: "प्रोफाइल देखें"
      },
      or: {
        title: "ଏଗ୍ରି ଗ୍ରୋ",
        welcome: "AI ଚାଳିତ ସ୍ମାର୍ଟ କୃଷି ପ୍ଲାଟଫର୍ମ",
        description: "AI-ଚାଳିତ ଅନ୍ତର୍ଦୃଷ୍ଟି ସହିତ ଆପଣଙ୍କ କୃଷିକୁ ପରିବର୍ତ୍ତନ କରନ୍ତୁ। ବ୍ୟକ୍ତିଗତ ଫସଲ ସୁପାରିଶ ପାଆନ୍ତୁ, ତୁରନ୍ତ ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ, ପାଣିପାଗ ପ୍ୟାଟର୍ନ ଉପରେ ନଜର ରଖନ୍ତୁ।",
        getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
        viewProfile: "ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ"
      },
      te: {
        title: "అగ్రి గ్రో",
        welcome: "AI నడిచే స్మార్ట్ వ్యవసాయ వేదిక",
        description: "AI-ఆధారిత అంతర్దృష్టులతో మీ వ్యవసాయాన్ని మార్చండి। వ్యక్తిగతీకరించిన పంట సిఫార్సులను పొందండి, వ్యాధులను తక్షణమే గుర్తించండి, వాతావరణ నమూనాలను పర్యవేక్షించండి।",
        getStarted: "ప్రారంభించండి",
        viewProfile: "ప్రొఫైల్ చూడండి"
      },
      ta: {
        title: "அக்ரி குரோ",
        welcome: "AI இயக்கப்படும் ஸ்மார்ட் விவசாய தளம்",
        description: "AI-இயக்கப்படும் நுண்ணறிவுகளுடன் உங்கள் விவசாயத்தை மாற்றுங்கள். தனிப்பயனாக்கப்பட்ட பயிர் பரிந்துரைகளைப் பெறுங்கள், நோய்களை உடனடியாக கண்டறியுங்கள், வானிலை முறைகளைக் கண்காணியுங்கள்।",
        getStarted: "தொடங்குங்கள்",
        viewProfile: "சுயவிவரம் பார்க்கவும்"
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
                <h1 className="text-4xl md:text-6xl font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {text.title}
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-semibold text-white/95">
                  {text.welcome}
                </h2>
                
                <p className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                  {text.description}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link to="/auth">
                    {text.getStarted}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm font-semibold px-8 py-3 rounded-lg transition-all duration-300"
                  asChild
                >
                  <Link to={user ? "/profile" : "/recommendations"}>
                    {text.viewProfile}
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