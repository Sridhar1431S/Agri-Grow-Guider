import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Sprout, Bug, MessageCircle, User, Globe } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NavigationProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
];

export function Navigation({ currentLanguage, onLanguageChange }: NavigationProps) {
  const { user } = useAuth();
  const location = useLocation();

  const getNavText = (key: string) => {
    const labels = {
      home: { en: "Home", hi: "होम", or: "ହୋମ", te: "హోమ్" },
      recommendations: { en: "Recommendations", hi: "सुझाव", or: "ସୁପାରିଶ", te: "సిఫార్సులు" },
      disease: { en: "Disease Detection", hi: "रोग पहचान", or: "ରୋଗ ଚିହ୍ନଟ", te: "వ్యాధి గుర్తింపు" },
      chat: { en: "Chat Interface", hi: "चैट इंटरफेस", or: "ଚାଟ୍ ଇଣ୍ଟରଫେସ୍", te: "చాట్ ఇంటర్‌ఫేస్" },
    };
    return labels[key]?.[currentLanguage] || labels[key]?.en;
  };

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">🌱</span>
            </div>
            <span className="font-bold text-lg text-foreground">AI-Driven Crop Recommendation System</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Home className="w-4 h-4" />
              <span>{getNavText("home")}</span>
            </Link>
            
            <Link
              to="/recommendations"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/recommendations" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Sprout className="w-4 h-4" />
              <span>{getNavText("recommendations")}</span>
            </Link>
            
            <Link
              to="/disease-detection"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/disease-detection" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Bug className="w-4 h-4" />
              <span>{getNavText("disease")}</span>
            </Link>
            
            <Link
              to="/chat"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/chat" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{getNavText("chat")}</span>
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Select value={currentLanguage} onValueChange={onLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="text-sm">{lang.native}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* User Status */}
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {user ? user.email?.split('@')[0] : 'Guest'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}