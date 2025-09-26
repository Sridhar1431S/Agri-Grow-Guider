import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Eye, 
  TrendingUp, 
  Calendar,
  Wheat,
  BarChart3
} from "lucide-react";

const crops = [
  { value: "rice", label: "Rice (ଚାଉଳ)", icon: "🌾" },
  { value: "wheat", label: "Wheat (ଗହମ)", icon: "🌾" },
  { value: "maize", label: "Maize (ମକା)", icon: "🌽" },
  { value: "sugarcane", label: "Sugarcane (ଆଖୁ)", icon: "🎋" },
  { value: "cotton", label: "Cotton (କପା)", icon: "🌱" },
];

interface FarmData {
  location: string;
  area: string;
  crop: string;
  previousYield: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  soilMoisture: number;
}

export function FarmDashboard() {
  const [farmData, setFarmData] = useState<FarmData>({
    location: "",
    area: "",
    crop: "",
    previousYield: "",
  });

  // Mock weather data - in real app, this would come from API
  const weatherData: WeatherData = {
    temperature: 28,
    humidity: 75,
    rainfall: 45,
    soilMoisture: 65,
  };

  // Mock prediction - in real app, this would use ML model
  const prediction = {
    expectedYield: 3.2,
    improvement: 15,
    confidence: 87,
  };

  const handlePredict = () => {
    // In real app, this would call ML prediction API
    console.log("Predicting yield for:", farmData);
  };

  return (
    <div className="space-y-6">
      {/* Farm Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Your Farm Details</span>
          </CardTitle>
          <CardDescription>
            Enter your farm information to get personalized predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Bhubaneswar, Odisha"
                value={farmData.location}
                onChange={(e) => setFarmData({ ...farmData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Farm Area (acres)</Label>
              <Input
                id="area"
                type="number"
                placeholder="e.g., 2.5"
                value={farmData.area}
                onChange={(e) => setFarmData({ ...farmData, area: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crop">Crop Type</Label>
              <Select value={farmData.crop} onValueChange={(value) => setFarmData({ ...farmData, crop: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.value} value={crop.value}>
                      <span className="flex items-center space-x-2">
                        <span>{crop.icon}</span>
                        <span>{crop.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousYield">Previous Yield (tons/acre)</Label>
              <Input
                id="previousYield"
                type="number"
                step="0.1"
                placeholder="e.g., 2.8"
                value={farmData.previousYield}
                onChange={(e) => setFarmData({ ...farmData, previousYield: e.target.value })}
              />
            </div>
          </div>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handlePredict}
            disabled={!farmData.location || !farmData.crop}
            className="w-full md:w-auto"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Predict Yield
          </Button>
        </CardContent>
      </Card>

      {/* Weather & Soil Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-2xl font-bold">{weatherData.temperature}°C</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-2xl font-bold">{weatherData.humidity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Rainfall</p>
                <p className="text-2xl font-bold">{weatherData.rainfall}mm</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Soil Moisture</p>
                <p className="text-2xl font-bold">{weatherData.soilMoisture}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prediction Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Yield Prediction</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Expected Yield</p>
              <p className="text-3xl font-bold text-primary">{prediction.expectedYield}</p>
              <p className="text-sm text-muted-foreground">tons/acre</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Improvement</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-3xl font-bold text-green-600">+{prediction.improvement}%</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Better
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Confidence</p>
              <p className="text-3xl font-bold text-blue-600">{prediction.confidence}%</p>
              <p className="text-sm text-muted-foreground">accuracy</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">🌱 Recommendations:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="text-green-600">💧</span>
                <span>Increase irrigation frequency by 20% during flowering stage</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600">🧪</span>
                <span>Apply nitrogen fertilizer (50kg/acre) in the next 2 weeks</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-600">🐛</span>
                <span>Monitor for pest activity - apply organic neem oil if needed</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}