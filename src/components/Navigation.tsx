import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Sprout, Bug, MessageCircle, User, Globe, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface NavigationProps {
  hideForGuests?: boolean;
}

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
];

export function Navigation({ hideForGuests = false }: NavigationProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navigation for non-signed-in users if hideForGuests is true
  if (hideForGuests && !user) {
    return null;
  }

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">🌱</span>
            </div>
            <span className="font-bold text-lg text-foreground">{t('appTitle')}</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden lg:flex items-center space-x-8">
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
                <span>{t('home')}</span>
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
                <span>{t('recommendations')}</span>
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
                <span>{t('disease')}</span>
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
                <span>{t('chat')}</span>
              </Link>
            </div>
          )}

          {/* Right side controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Language Selector */}
            <div className="hidden sm:flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Select value={currentLanguage} onValueChange={setLanguage}>
                <SelectTrigger className="w-24 sm:w-32">
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

            {/* User Status - Desktop */}
            {user && (
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile" className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm hidden md:inline">{t('profile')}</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={signOut} className="text-xs sm:text-sm">
                  {t('signOut')}
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && mobileMenuOpen && (
          <div className="sm:hidden border-t border-border/50 py-4 space-y-2">
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>{t('home')}</span>
            </Link>
            
            <Link
              to="/recommendations"
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/recommendations" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sprout className="w-5 h-5" />
              <span>{t('recommendations')}</span>
            </Link>
            
            <Link
              to="/disease-detection"
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/disease-detection" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bug className="w-5 h-5" />
              <span>{t('disease')}</span>
            </Link>
            
            <Link
              to="/chat"
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location.pathname === "/chat" 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('chat')}</span>
            </Link>

            <div className="border-t border-border/50 pt-4 mt-4 space-y-2">
              <Link
                to="/profile"
                className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>{t('profile')}</span>
              </Link>

              {/* Mobile Language Selector */}
              <div className="flex items-center space-x-3 px-4 py-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <Select value={currentLanguage} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
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

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full mx-4"
              >
                {t('signOut')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}