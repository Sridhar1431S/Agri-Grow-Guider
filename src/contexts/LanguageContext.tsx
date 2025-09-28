import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'or' | 'te' | 'ta';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, category?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    home: "Home",
    recommendations: "Recommendations", 
    disease: "Disease Detection",
    chat: "Chat Interface",
    profile: "Profile",
    signOut: "Sign Out",
    
    // Landing/Hero
    appTitle: "Agri Grow",
    welcome: "AI-Powered Smart Farming Platform",
    description: "Transform your farming with AI-driven insights. Get personalized crop recommendations, detect diseases instantly, monitor weather patterns, and chat with our intelligent farming assistant.",
    getStarted: "Get Started",
    viewProfile: "View Profile",
    
    // Profile
    editProfile: "Edit Profile",
    personalInfo: "Personal Information",
    farmInfo: "Farm Information", 
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone",
    farmLocation: "Farm Location",
    farmSize: "Farm Size (acres)",
    primaryCrops: "Primary Crops",
    preferredLanguage: "Preferred Language",
    saveProfile: "Save Profile",
    profileSummary: "Profile Summary",
    
    // AI Assistant
    farmAssistant: "Farm Assistant",
    voiceOn: "Voice On",
    voiceOff: "Voice Off",
    listening: "🎤 Listening... Speak now",
    thinking: "AI is thinking...",
    welcomeMessage: "Hello! I'm your farming assistant. Ask me anything about crops, irrigation, fertilizers, or weather.",
    inputPlaceholder: "Type your question here...",
  },
  hi: {
    // Navigation
    home: "होम",
    recommendations: "सुझाव",
    disease: "रोग पहचान", 
    chat: "चैट इंटरफेस",
    profile: "प्रोफाइल",
    signOut: "साइन आउट",
    
    // Landing/Hero
    appTitle: "एग्री ग्रो",
    welcome: "AI संचालित स्मार्ट कृषि प्लेटफॉर्म",
    description: "AI-संचालित अंतर्दृष्टि के साथ अपनी कृषि को बदलें। व्यक्तिगत फसल सुझाव प्राप्त करें, तुरंत रोगों का पता लगाएं, मौसम पैटर्न की निगरानी करें।",
    getStarted: "शुरू करें",
    viewProfile: "प्रोफाइल देखें",
    
    // Profile
    editProfile: "प्रोफाइल संपादित करें",
    personalInfo: "व्यक्तिगत जानकारी",
    farmInfo: "खेत की जानकारी",
    firstName: "पहला नाम",
    lastName: "अंतिम नाम", 
    phone: "फोन",
    farmLocation: "खेत का स्थान",
    farmSize: "खेत का आकार (एकड़)",
    primaryCrops: "मुख्य फसलें",
    preferredLanguage: "पसंदीदा भाषा",
    saveProfile: "प्रोफाइल सहेजें",
    profileSummary: "प्रोफाइल सारांश",
    
    // AI Assistant
    farmAssistant: "कृषि सहायक",
    voiceOn: "आवाज चालू",
    voiceOff: "आवाज बंद",
    listening: "🎤 सुन रहा है... अब बोलें",
    thinking: "AI सोच रहा है...",
    welcomeMessage: "नमस्ते! मैं आपका कृषि सहायक हूं। फसल, सिंचाई, उर्वरक या मौसम के बारे में कुछ भी पूछें।",
    inputPlaceholder: "अपना प्रश्न यहाँ लिखें...",
  },
  or: {
    // Navigation  
    home: "ହୋମ",
    recommendations: "ସୁପାରିଶ",
    disease: "ରୋଗ ଚିହ୍ନଟ",
    chat: "ଚାଟ୍ ଇଣ୍ଟରଫେସ୍",
    profile: "ପ୍ରୋଫାଇଲ୍",
    signOut: "ସାଇନ୍ ଆଉଟ୍",
    
    // Landing/Hero
    appTitle: "ଏଗ୍ରି ଗ୍ରୋ",
    welcome: "AI ଚାଳିତ ସ୍ମାର୍ଟ କୃଷି ପ୍ଲାଟଫର୍ମ",
    description: "AI-ଚାଳିତ ଅନ୍ତର୍ଦୃଷ୍ଟି ସହିତ ଆପଣଙ୍କ କୃଷିକୁ ପରିବର୍ତ୍ତନ କରନ୍ତୁ। ବ୍ୟକ୍ତିଗତ ଫସଲ ସୁପାରିଶ ପାଆନ୍ତୁ, ତୁରନ୍ତ ରୋଗ ଚିହ୍ନଟ କରନ୍ତୁ।",
    getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",
    viewProfile: "ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ",
    
    // Profile
    editProfile: "ପ୍ରୋଫାଇଲ୍ ସମ୍ପାଦନା କରନ୍ତୁ",
    personalInfo: "ବ୍ୟକ୍ତିଗତ ସୂଚନା",
    farmInfo: "ଚାଷ ସୂଚନା",
    firstName: "ପ୍ରଥମ ନାମ",
    lastName: "ଶେଷ ନାମ",
    phone: "ଫୋନ୍",
    farmLocation: "ଚାଷ ସ୍ଥାନ",
    farmSize: "ଚାଷ ଆକାର (ଏକର)",
    primaryCrops: "ମୁଖ୍ୟ ଫସଲ",
    preferredLanguage: "ପସନ୍ଦ ଭାଷା",
    saveProfile: "ପ୍ରୋଫାଇଲ୍ ସେଭ୍ କରନ୍ତୁ",
    profileSummary: "ପ୍ରୋଫାଇଲ୍ ସାରାଂଶ",
    
    // AI Assistant
    farmAssistant: "କୃଷି ସହାୟକ",
    voiceOn: "ସ୍ୱର ଚାଲୁ",
    voiceOff: "ସ୍ୱର ବନ୍ଦ",
    listening: "🎤 ଶୁଣୁଛି... ବର୍ତ୍ତମାନ କୁହନ୍ତୁ",
    thinking: "AI ଚିନ୍ତା କରୁଛି...",
    welcomeMessage: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର କୃଷି ସହାୟକ। ଫସଲ, ଜଳସେଚନ, ସାର କିମ୍ବା ପାଣିପାଗ ବିଷୟରେ କିଛି ପଚାରନ୍ତୁ।",
    inputPlaceholder: "ଆପଣଙ୍କର ପ୍ରଶ୍ନ ଏଠାରେ ଲେଖନ୍ତୁ...",
  },
  te: {
    // Navigation
    home: "హోమ్",
    recommendations: "సిఫార్సులు", 
    disease: "వ్యాధి గుర్తింపు",
    chat: "చాట్ ఇంటర్‌ఫేస్",
    profile: "ప్రొఫైల్",
    signOut: "సైన్ అవుట్",
    
    // Landing/Hero
    appTitle: "అగ్రి గ్రో",
    welcome: "AI నడిచే స్మార్ట్ వ్యవసాయ వేదిక",
    description: "AI-ఆధారిత అంతర్దృష్టులతో మీ వ్యవసాయాన్ని మార్చండి। వ్యక్తిగతీకరించిన పంట సిఫార్సులను పొందండి, వ్యాధులను తక్షణమే గుర్తించండి।",
    getStarted: "ప్రారంభించండి",
    viewProfile: "ప్రొఫైల్ చూడండి",
    
    // Profile
    editProfile: "ప్రొఫైల్ సవరించండి",
    personalInfo: "వ్యక్తిగత సమాచారం",
    farmInfo: "వ్యవసాయ సమాచారం",
    firstName: "మొదటి పేరు",
    lastName: "చివరి పేరు",
    phone: "ఫోన్",
    farmLocation: "వ్యవసాయ స్థలం",
    farmSize: "వ్యవసాయ పరిమాణం (ఎకరాలు)",
    primaryCrops: "ప్రధాన పంటలు",
    preferredLanguage: "ప్రాధాన్య భాష",
    saveProfile: "ప్రొఫైల్ సేవ్ చేయండి",
    profileSummary: "ప్రొఫైల్ సారాంశం",
    
    // AI Assistant
    farmAssistant: "వ్యవసాయ సహాయకుడు",
    voiceOn: "వాయిస్ ఆన్",
    voiceOff: "వాయిస్ ఆఫ్",
    listening: "🎤 వింటున్నాను... ఇప్పుడు మాట్లాడండి",
    thinking: "AI ఆలోచిస్తున్నాడు...",
    welcomeMessage: "హలో! నేను మీ వ్యవసాయ సహాయకుడను. పంటలు, నీటిపారుదల, ఎరువులు లేదా వాతావరణం గురించి ఏదైనా అడగండి।",
    inputPlaceholder: "మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి...",
  },
  ta: {
    // Navigation
    home: "முகப்பு",
    recommendations: "பரிந்துரைகள்",
    disease: "நோய் கண்டறிதல்",
    chat: "அரட்டை இடைமுகம்",
    profile: "சுயவிவரம்",
    signOut: "வெளியேறு",
    
    // Landing/Hero  
    appTitle: "அக்ரி குரோ",
    welcome: "AI இயக்கப்படும் ஸ்மார்ட் விவசாய தளம்",
    description: "AI-இயக்கப்படும் நுண்ணறிவுகளுடன் உங்கள் விவசாயத்தை மாற்றுங்கள். தனிப்பயனாக்கப்பட்ட பயிர் பரிந்துரைகளைப் பெறுங்கள், நோய்களை உடனடியாக கண்டறியுங்கள்।",
    getStarted: "தொடங்குங்கள்",
    viewProfile: "சுயவிவரம் பார்க்கவும்",
    
    // Profile
    editProfile: "சுயவிவரத்தைத் திருத்து",
    personalInfo: "தனிப்பட்ட தகவல்",
    farmInfo: "பண்ணை தகவல்",
    firstName: "முதல் பெயர்",
    lastName: "கடைசி பெயர்",
    phone: "தொலைபேசி",
    farmLocation: "பண்ணை இடம்",
    farmSize: "பண்ணை அளவு (ஏக்கர்)",
    primaryCrops: "முதன்மை பயிர்கள்",
    preferredLanguage: "விருப்பமான மொழி",
    saveProfile: "சுயவிவரத்தை சேமி",
    profileSummary: "சுயவிவர சுருக்கம்",
    
    // AI Assistant
    farmAssistant: "பண்ணை உதவியாளர்",
    voiceOn: "குரல் இயக்கம்",
    voiceOff: "குரல் நிறுத்தம்",
    listening: "🎤 கேட்கிறது... இப்போது பேசுங்கள்",
    thinking: "AI சிந்தித்துக்கொண்டிருக்கிறது...",
    welcomeMessage: "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். பயிர்கள், நீர்ப்பாசனம், உரங்கள் அல்லது வானிலை பற்றி எதுவும் கேட்கவும்.",
    inputPlaceholder: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...",
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('agri-grow-language');
    return (saved as SupportedLanguage) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agri-grow-language', currentLanguage);
  }, [currentLanguage]);

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
  };

  const t = (key: string, category?: string): string => {
    const langTranslations = translations[currentLanguage] || translations.en;
    return langTranslations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}