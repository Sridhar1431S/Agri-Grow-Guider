import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Volume2,
  VolumeX 
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  language: string;
  isVoiceEnabled: boolean;
}

export function AIAssistant({ language, isVoiceEnabled }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: getWelcomeMessage(language),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock responses based on language
  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("water") || lowerMessage.includes("irrigation") || lowerMessage.includes("ପାଣି")) {
      return getIrrigationAdvice(language);
    } else if (lowerMessage.includes("fertilizer") || lowerMessage.includes("ସାର")) {
      return getFertilizerAdvice(language);
    } else if (lowerMessage.includes("pest") || lowerMessage.includes("କୀଟ")) {
      return getPestAdvice(language);
    } else if (lowerMessage.includes("weather") || lowerMessage.includes("ପାଣି")) {
      return getWeatherAdvice(language);
    } else {
      return getGeneralAdvice(language);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: getResponse(input),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-speak response if voice is enabled
      if (isVoiceEnabled) {
        speakText(assistantMessage.content);
      }
    }, 1000);
  };

  const toggleListening = () => {
    if (!isVoiceEnabled) return;
    
    if (isListening) {
      // Stop listening
      setIsListening(false);
    } else {
      // Start listening - mock implementation
      setIsListening(true);
      
      // Simulate voice recognition
      setTimeout(() => {
        setInput("How much water should I give to my rice crop?");
        setIsListening(false);
      }, 3000);
    }
  };

  const speakText = (text: string) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language based on current selection
    switch (language) {
      case "hi":
        utterance.lang = "hi-IN";
        break;
      case "or":
        utterance.lang = "or-IN";
        break;
      default:
        utterance.lang = "en-US";
    }
    
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-primary" />
            <span>Farm Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            {isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
              >
                <VolumeX className="w-4 h-4" />
              </Button>
            )}
            <Badge variant={isVoiceEnabled ? "default" : "secondary"}>
              {isVoiceEnabled ? "Voice On" : "Voice Off"}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "assistant" && (
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                {message.type === "user" && (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
                
                {message.type === "assistant" && isVoiceEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(message.content)}
                    className="p-1"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 flex items-center space-x-2">
            <Input
              placeholder={getInputPlaceholder(language)}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isListening}
            />
            
            {isVoiceEnabled && (
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={toggleListening}
                className="flex-shrink-0"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          
          <Button onClick={handleSendMessage} disabled={!input.trim() || isListening}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {isListening && (
          <div className="text-center">
            <Badge variant="destructive" className="animate-pulse">
              🎤 Listening... Speak now
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Multilingual helper functions
function getWelcomeMessage(language: string): string {
  switch (language) {
    case "hi":
      return "नमस्ते! मैं आपका कृषि सहायक हूं। फसल, सिंचाई, उर्वरक या मौसम के बारे में कुछ भी पूछें।";
    case "or":
      return "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର କୃଷି ସହାୟକ। ଫସଲ, ଜଳସେଚନ, ସାର କିମ୍ବା ପାଣିପାଗ ବିଷୟରେ କିଛି ପଚାରନ୍ତୁ।";
    default:
      return "Hello! I'm your farming assistant. Ask me anything about crops, irrigation, fertilizers, or weather.";
  }
}

function getInputPlaceholder(language: string): string {
  switch (language) {
    case "hi":
      return "अपना प्रश्न यहाँ लिखें...";
    case "or":
      return "ଆପଣଙ୍କର ପ୍ରଶ୍ନ ଏଠାରେ ଲେଖନ୍ତୁ...";
    default:
      return "Type your question here...";
  }
}

function getIrrigationAdvice(language: string): string {
  switch (language) {
    case "hi":
      return "धान की फसल के लिए: फूल आने के समय रोज 2-3 सेमी पानी दें। मिट्टी में हमेशा 2-5 सेमी पानी रखें। सुबह के समय पानी दें।";
    case "or":
      return "ଧାନ ଫସଲ ପାଇଁ: ଫୁଲ ସମୟରେ ପ୍ରତିଦିନ ୨-୩ ସେମି ପାଣି ଦିଅନ୍ତୁ। ମାଟିରେ ସର୍ବଦା ୨-୫ ସେମି ପାଣି ରଖନ୍ତୁ। ସକାଳ ସମୟରେ ପାଣି ଦିଅନ୍ତୁ।";
    default:
      return "For rice crops: During flowering stage, maintain 2-3cm of water daily. Keep 2-5cm standing water in fields. Water in early morning for best results.";
  }
}

function getFertilizerAdvice(language: string): string {
  switch (language) {
    case "hi":
      return "धान के लिए: 120kg नाइट्रोजन, 60kg फास्फोरस, 40kg पोटाश प्रति हेक्टेयर। 3 बार में डालें - बुआई, टिलरिंग, और फूल आने पर।";
    case "or":
      return "ଧାନ ପାଇଁ: ୧୨୦କେଜି ନାଇଟ୍ରୋଜେନ, ୬୦କେଜି ଫସଫରସ, ୪୦କେଜି ପୋଟାସ ପ୍ରତି ହେକ୍ଟର। ୩ ଥର ଦିଅନ୍ତୁ - ବୁଣିବା, କୁସି ଫୁଟିବା, ଏବଂ ଫୁଲ ସମୟରେ।";
    default:
      return "For rice: Apply 120kg Nitrogen, 60kg Phosphorus, 40kg Potash per hectare. Split into 3 applications - at sowing, tillering, and flowering stages.";
  }
}

function getPestAdvice(language: string): string {
  switch (language) {
    case "hi":
      return "कीट नियंत्रण के लिए: नीम के तेल का छिड़काव करें (5ml प्रति लीटर पानी)। जैविक कीटनाशक प्राथमिकता दें। खेत की नियमित जांच करें।";
    case "or":
      return "କୀଟ ନିୟନ୍ତ୍ରଣ ପାଇଁ: ନିମ ତେଲ ସ୍ପ୍ରେ କରନ୍ତୁ (୫ମିଲି ପ୍ରତି ଲିଟର ପାଣିରେ)। ଜୈବିକ କୀଟନାଶକକୁ ପ୍ରାଧାନ୍ୟ ଦିଅନ୍ତୁ। ନିୟମିତ ଚାଷ ଯାଞ୍ଚ କରନ୍ତୁ।";
    default:
      return "For pest control: Spray neem oil solution (5ml per liter water). Prefer organic pesticides. Regular field monitoring is essential.";
  }
}

function getWeatherAdvice(language: string): string {
  switch (language) {
    case "hi":
      return "मौसम के अनुसार: बारिश से पहले खेत में ड्रेनेज बनाएं। तेज धूप में दोपहर 12-3 बजे सिंचाई न करें। तापमान 35°C से ऊपर हो तो छाया प्रदान करें।";
    case "or":
      return "ପାଣିପାଗ ଅନୁସାରେ: ବର୍ଷା ପୂର୍ବରୁ ଚାଷରେ ଜଳ ନିଷ୍କାସନ ବ୍ୟବସ୍ଥା କରନ୍ତୁ। ପ୍ରଖର ରୋଦରେ ଦୁପୁର ୧୨-୩ ଟା ମଧ୍ୟରେ ଜଳସେଚନ କରନ୍ତୁ ନାହିଁ।";
    default:
      return "Weather-based advice: Create drainage before monsoon. Avoid irrigation during 12-3 PM in hot weather. Provide shade when temperature exceeds 35°C.";
  }
}

function getGeneralAdvice(language: string): string {
  switch (language) {
    case "hi":
      return "सामान्य सलाह: मिट्टी की जांच कराएं, जैविक खाद का उपयोग करें, फसल चक्र अपनाएं। स्थानीय कृषि विभाग से संपर्क रखें।";
    case "or":
      return "ସାଧାରଣ ସଲାହ: ମାଟି ପରୀକ୍ଷା କରାନ୍ତୁ, ଜୈବିକ ସାର ବ୍ୟବହାର କରନ୍ତୁ, ଫସଲ ଚକ୍ର ଅପନାନ୍ତୁ। ସ୍ଥାନୀୟ କୃଷି ବିଭାଗ ସହିତ ଯୋଗାଯୋଗ ରଖନ୍ତୁ।";
    default:
      return "General advice: Test your soil regularly, use organic fertilizers, practice crop rotation. Stay connected with local agriculture department for updates.";
  }
}