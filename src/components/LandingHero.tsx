import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-agriculture.jpg";

export function LandingHero() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto w-full">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-6 sm:p-8 lg:p-12 space-y-6">
              <div className="text-center space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent leading-tight">
                  {t('appTitle')}
                </h1>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/95">
                  {t('welcome')}
                </h2>
                
                <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-3xl mx-auto px-4">
                  {t('description')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  asChild
                >
                  <Link to={user ? "/app" : "/auth"}>
                    {t('getStarted')}
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm font-semibold px-6 sm:px-8 py-3 rounded-lg transition-all duration-300 w-full sm:w-auto"
                  asChild
                >
                  <Link to={user ? "/chat" : "/auth"}>
                    {user ? t('chat') : 'Learn More'}
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