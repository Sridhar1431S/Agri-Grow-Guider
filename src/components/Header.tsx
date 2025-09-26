import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Mic, MicOff, User } from "lucide-react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
];

interface HeaderProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
}

export function Header({ currentLanguage, onLanguageChange, isVoiceActive, onToggleVoice }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">🌱</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">CropAI</h1>
            </div>
          </div>

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

            {/* Voice Toggle */}
            <Button
              variant={isVoiceActive ? "default" : "outline"}
              size="icon"
              onClick={onToggleVoice}
              className="relative"
            >
              {isVoiceActive ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
              {isVoiceActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="icon">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}