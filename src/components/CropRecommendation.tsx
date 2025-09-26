import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  Thermometer,
  Droplets,
  TrendingUp,
  Clock,
  DollarSign,
  Shield
} from 'lucide-react';

interface CropInput {
  location: string;
  soilType: string;
  season: string;
  budget: string;
  experience: string;
  farmSize: number;
}

interface CropRecommendation {
  name: string;
  varieties: string[];
  suitability: number;
  expectedYield: string;
  duration: string;
  investment: string;
  marketPrice: string;
  benefits: string[];
  challenges: string[];
  icon: string;
}

export function CropRecommendation() {
  const [inputs, setInputs] = useState<CropInput>({
    location: '',
    soilType: '',
    season: '',
    budget: '',
    experience: '',
    farmSize: 0
  });
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGetRecommendations = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockRecommendations: CropRecommendation[] = [
        {
          name: 'Rice (Paddy)',
          varieties: ['Swarna', 'IR-36', 'Pusa Basmati'],
          suitability: 95,
          expectedYield: '4.5-6 tons/acre',
          duration: '120-150 days',
          investment: '₹25,000-35,000/acre',
          marketPrice: '₹2,000-2,500/quintal',
          benefits: ['High demand', 'Stable market', 'Government support', 'Good for clay soil'],
          challenges: ['Water intensive', 'Pest management required'],
          icon: '🌾'
        },
        {
          name: 'Wheat',
          varieties: ['HD-2967', 'PBW-343', 'WH-542'],
          suitability: 88,
          expectedYield: '3.5-5 tons/acre',
          duration: '110-130 days',
          investment: '₹20,000-30,000/acre',
          marketPrice: '₹2,200-2,800/quintal',
          benefits: ['Lower water requirement', 'Good storage life', 'Multiple varieties'],
          challenges: ['Weather dependent', 'Market fluctuation'],
          icon: '🌾'
        },
        {
          name: 'Sugarcane',
          varieties: ['Co-238', 'Co-86032', 'Co-0238'],
          suitability: 82,
          expectedYield: '80-120 tons/acre',
          duration: '12-18 months',
          investment: '₹40,000-60,000/acre',
          marketPrice: '₹350-450/quintal',
          benefits: ['High yield', 'Ratoon crops possible', 'Industrial demand'],
          challenges: ['Long duration', 'High investment', 'Water intensive'],
          icon: '🎋'
        },
        {
          name: 'Cotton',
          varieties: ['Bt Cotton', 'Suraj', 'Shankar-6'],
          suitability: 75,
          expectedYield: '15-25 quintals/acre',
          duration: '180-200 days',
          investment: '₹30,000-45,000/acre',
          marketPrice: '₹5,500-7,000/quintal',
          benefits: ['High value crop', 'Export potential', 'Textile industry demand'],
          challenges: ['Pest management critical', 'Weather sensitive'],
          icon: '🌱'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 80) return 'bg-yellow-600';
    if (score >= 70) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const getSuitabilityLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-green-600" />
            <span>Crop Recommendation Engine</span>
          </CardTitle>
          <CardDescription>
            Get AI-powered crop suggestions based on your location, soil, and farming conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Bhubaneswar, Odisha"
                value={inputs.location}
                onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Soil Type</Label>
              <Select value={inputs.soilType} onValueChange={(value) => setInputs({ ...inputs, soilType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="loam">Loam</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="silt">Silt</SelectItem>
                  <SelectItem value="black">Black Cotton</SelectItem>
                  <SelectItem value="red">Red Laterite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Season
              </Label>
              <Select value={inputs.season} onValueChange={(value) => setInputs({ ...inputs, season: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                  <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                  <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                  <SelectItem value="perennial">Perennial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                Budget Range
              </Label>
              <Select value={inputs.budget} onValueChange={(value) => setInputs({ ...inputs, budget: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (₹10,000-25,000/acre)</SelectItem>
                  <SelectItem value="medium">Medium (₹25,000-50,000/acre)</SelectItem>
                  <SelectItem value="high">High (₹50,000+/acre)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Farming Experience</Label>
              <Select value={inputs.experience} onValueChange={(value) => setInputs({ ...inputs, experience: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                  <SelectItem value="experienced">Experienced (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmSize">Farm Size (acres)</Label>
              <Input
                id="farmSize"
                type="number"
                step="0.1"
                placeholder="e.g., 2.5"
                value={inputs.farmSize || ''}
                onChange={(e) => setInputs({ ...inputs, farmSize: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <Button 
            onClick={handleGetRecommendations}
            disabled={isAnalyzing || !inputs.location || !inputs.soilType || !inputs.season}
            className="w-full md:w-auto"
          >
            {isAnalyzing ? "Analyzing..." : "Get Crop Recommendations"}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommended Crops for Your Farm</h3>
          
          {recommendations.map((crop, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{crop.icon}</span>
                    <span>{crop.name}</span>
                  </CardTitle>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium">Suitability:</span>
                      <Badge className={getSuitabilityColor(crop.suitability)}>
                        {getSuitabilityLabel(crop.suitability)}
                      </Badge>
                    </div>
                    <Progress value={crop.suitability} className="w-24 h-2" />
                  </div>
                </div>
                <CardDescription>
                  Recommended varieties: {crop.varieties.join(', ')}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    <p className="text-sm font-medium">Expected Yield</p>
                    <p className="text-xs text-muted-foreground">{crop.expectedYield}</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-xs text-muted-foreground">{crop.duration}</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <p className="text-sm font-medium">Investment</p>
                    <p className="text-xs text-muted-foreground">{crop.investment}</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <Thermometer className="w-5 h-5 mx-auto mb-1 text-red-600" />
                    <p className="text-sm font-medium">Market Price</p>
                    <p className="text-xs text-muted-foreground">{crop.marketPrice}</p>
                  </div>
                </div>

                {/* Benefits and Challenges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Benefits
                    </h4>
                    <ul className="space-y-1">
                      {crop.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2 flex items-center">
                      <Alert className="w-4 h-4 mr-1" />
                      Challenges
                    </h4>
                    <ul className="space-y-1">
                      {crop.challenges.map((challenge, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-orange-600 mr-2">•</span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Alert>
            <Sprout className="w-4 h-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Consider crop rotation and intercropping for better soil health and increased income. 
              Consult with local agricultural experts for region-specific advice.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}