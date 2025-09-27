import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Navigation } from "@/components/Navigation";

interface DiseaseDetectionProps {
  language?: string;
}

export default function DiseaseDetection({ language = "en" }: DiseaseDetectionProps) {
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getContent = () => {
    const content = {
      en: {
        title: "Disease Detection",
        subtitle: "Upload a photo of your crop to detect diseases and get treatment recommendations",
        uploadTitle: "Upload Crop Image",
        uploadDesc: "Take or upload a clear photo of the affected plant",
        analyzeButton: "Analyze Image",
        analyzing: "Analyzing...",
        results: "Analysis Results",
        confidence: "Confidence",
        treatment: "Treatment Recommendations",
        prevention: "Prevention Tips"
      },
      hi: {
        title: "रोग पहचान",
        subtitle: "रोगों का पता लगाने और उपचार की सिफारिशें प्राप्त करने के लिए अपनी फसल की फोटो अपलोड करें",
        uploadTitle: "फसल की छवि अपलोड करें",
        uploadDesc: "प्रभावित पौधे की स्पष्ट तस्वीर लें या अपलोड करें",
        analyzeButton: "छवि का विश्लेषण करें",
        analyzing: "विश्लेषण हो रहा है...",
        results: "विश्लेषण परिणाम",
        confidence: "विश्वास",
        treatment: "उपचार की सिफारिशें",
        prevention: "रोकथाम के उपाय"
      },
      or: {
        title: "ରୋଗ ଚିହ୍ନଟ",
        subtitle: "ରୋଗ ଚିହ୍ନଟ କରିବା ଏବଂ ଚିକିତ୍ସା ସୁପାରିଶ ପାଇବା ପାଇଁ ଆପଣଙ୍କ ଫସଲର ଫଟୋ ଅପଲୋଡ କରନ୍ତୁ",
        uploadTitle: "ଫସଲ ଚିତ୍ର ଅପଲୋଡ କରନ୍ତୁ",
        uploadDesc: "ପ୍ରଭାବିତ ଉଦ୍ଭିଦର ସ୍ପଷ୍ଟ ଫଟୋ ନିଅନ୍ତୁ କିମ୍ବା ଅପଲୋଡ କରନ୍ତୁ",
        analyzeButton: "ଚିତ୍ର ବିଶ୍ଳେଷଣ କରନ୍ତୁ",
        analyzing: "ବିଶ୍ଳେଷଣ ହେଉଛି...",
        results: "ବିଶ୍ଳେଷଣ ଫଳାଫଳ",
        confidence: "ବିଶ୍ୱାସ",
        treatment: "ଚିକିତ୍ସା ସୁପାରିଶ",
        prevention: "ପ୍ରତିରୋଧ ଟିପ୍ସ"
      },
      te: {
        title: "వ్యాధి గుర్తింపు",
        subtitle: "వ్యాధులను గుర్తించడానికి మరియు చికిత్స సిఫార్సులను పొందడానికి మీ పంట ఫోટోను అప్‌లోడ్ చేయండి",
        uploadTitle: "పంట చిత్రాన్ని అప్‌లోడ్ చేయండి",
        uploadDesc: "ప్రభావిత మొక్క యొక్క స్పష్టమైన ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి",
        analyzeButton: "చిత్రాన్ని విశ్లేషించండి",
        analyzing: "విశ్లేషిస్తోంది...",
        results: "విశ్లేషణ ఫలితాలు",
        confidence: "విశ్వాసం",
        treatment: "చికిత్స సిఫార్సులు",
        prevention: "నివారణ చిట్కాలు"
      }
    };
    
    return content[currentLanguage] || content.en;
  };

  const text = getContent();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        disease: "Leaf Spot Disease",
        confidence: 87,
        severity: "Moderate",
        treatment: [
          "Apply copper-based fungicide spray",
          "Remove affected leaves immediately",
          "Improve air circulation around plants",
          "Reduce watering frequency"
        ],
        prevention: [
          "Avoid overhead watering",
          "Maintain proper plant spacing",
          "Use disease-resistant varieties",
          "Apply preventive fungicide treatments"
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">{text.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {text.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="w-5 h-5" />
                <span>{text.uploadTitle}</span>
              </CardTitle>
              <CardDescription>{text.uploadDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-48 object-cover mx-auto rounded-lg"
                    />
                    <Button variant="outline" onClick={() => {
                      setSelectedImage(null);
                      setImagePreview(null);
                      setAnalysis(null);
                    }}>
                      Upload Different Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>Choose Image</span>
                        </Button>
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Supports JPG, PNG, WebP formats
                    </p>
                  </div>
                )}
              </div>

              {selectedImage && (
                <Button 
                  onClick={analyzeImage} 
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? text.analyzing : text.analyzeButton}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>{text.results}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{analysis.disease}</h3>
                      <p className="text-sm text-muted-foreground">
                        {text.confidence}: {analysis.confidence}%
                      </p>
                    </div>
                    <Badge variant={analysis.severity === "High" ? "destructive" : analysis.severity === "Moderate" ? "secondary" : "default"}>
                      {analysis.severity}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
                        {text.treatment}
                      </h4>
                      <ul className="space-y-1">
                        {analysis.treatment.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-primary" />
                        {text.prevention}
                      </h4>
                      <ul className="space-y-1">
                        {analysis.prevention.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload an image to get disease analysis results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}