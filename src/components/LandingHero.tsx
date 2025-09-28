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
      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {t('appTitle')}
                </h1>
                
                <h2 className="text-2xl md:text-3xl font-semibold text-white/95">
                  {t('welcome')}
                </h2>
                
                <p className="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                  {t('description')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link to={user ? "/app" : "/auth"}>
                    {t('getStarted')}
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
                    {t('viewProfile')}
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