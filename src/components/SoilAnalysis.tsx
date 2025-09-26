import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TestTube, 
  Droplets, 
  Zap, 
  Leaf, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organic_matter: number;
  moisture: number;
}

interface SoilRecommendation {
  nutrient: string;
  status: 'low' | 'optimal' | 'high';
  action: string;
  icon: React.ReactNode;
}

export function SoilAnalysis() {
  const [soilData, setSoilData] = useState<SoilData>({
    ph: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    organic_matter: 0,
    moisture: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasResults, setHasResults] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasResults(true);
    }, 2000);
  };

  const getStatus = (value: number, optimal: [number, number]): 'low' | 'optimal' | 'high' => {
    if (value < optimal[0]) return 'low';
    if (value > optimal[1]) return 'high';
    return 'optimal';
  };

  const getStatusColor = (status: 'low' | 'optimal' | 'high') => {
    switch (status) {
      case 'low': return 'text-orange-600';
      case 'high': return 'text-red-600';
      case 'optimal': return 'text-green-600';
    }
  };

  const getStatusIcon = (status: 'low' | 'optimal' | 'high') => {
    switch (status) {
      case 'low': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'optimal': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getRecommendations = (): SoilRecommendation[] => {
    const recommendations: SoilRecommendation[] = [];

    // pH analysis (optimal 6.0-7.5)
    const phStatus = getStatus(soilData.ph, [6.0, 7.5]);
    if (phStatus === 'low') {
      recommendations.push({
        nutrient: 'pH Level',
        status: phStatus,
        action: 'Apply lime to increase soil pH and reduce acidity',
        icon: <TestTube className="w-4 h-4" />
      });
    } else if (phStatus === 'high') {
      recommendations.push({
        nutrient: 'pH Level',
        status: phStatus,
        action: 'Apply sulfur or organic matter to lower pH',
        icon: <TestTube className="w-4 h-4" />
      });
    }

    // Nitrogen analysis (optimal 20-40 ppm)
    const nStatus = getStatus(soilData.nitrogen, [20, 40]);
    if (nStatus === 'low') {
      recommendations.push({
        nutrient: 'Nitrogen',
        status: nStatus,
        action: 'Apply nitrogen fertilizer (urea 50kg/acre) or organic compost',
        icon: <Leaf className="w-4 h-4" />
      });
    }

    // Phosphorus analysis (optimal 15-30 ppm)
    const pStatus = getStatus(soilData.phosphorus, [15, 30]);
    if (pStatus === 'low') {
      recommendations.push({
        nutrient: 'Phosphorus',
        status: pStatus,
        action: 'Apply DAP fertilizer (30kg/acre) before sowing',
        icon: <Zap className="w-4 h-4" />
      });
    }

    // Potassium analysis (optimal 150-300 ppm)
    const kStatus = getStatus(soilData.potassium, [150, 300]);
    if (kStatus === 'low') {
      recommendations.push({
        nutrient: 'Potassium',
        status: kStatus,
        action: 'Apply muriate of potash (25kg/acre) during flowering',
        icon: <TrendingUp className="w-4 h-4" />
      });
    }

    // Moisture analysis (optimal 40-70%)
    const mStatus = getStatus(soilData.moisture, [40, 70]);
    if (mStatus === 'low') {
      recommendations.push({
        nutrient: 'Moisture',
        status: mStatus,
        action: 'Increase irrigation frequency and consider mulching',
        icon: <Droplets className="w-4 h-4" />
      });
    }

    return recommendations;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="w-5 h-5 text-primary" />
            <span>Soil Analysis</span>
          </CardTitle>
          <CardDescription>
            Enter your soil test results for AI-powered analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ph">pH Level</Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                min="0"
                max="14"
                placeholder="6.5"
                value={soilData.ph || ''}
                onChange={(e) => setSoilData({ ...soilData, ph: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nitrogen">Nitrogen (ppm)</Label>
              <Input
                id="nitrogen"
                type="number"
                placeholder="25"
                value={soilData.nitrogen || ''}
                onChange={(e) => setSoilData({ ...soilData, nitrogen: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
              <Input
                id="phosphorus"
                type="number"
                placeholder="20"
                value={soilData.phosphorus || ''}
                onChange={(e) => setSoilData({ ...soilData, phosphorus: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="potassium">Potassium (ppm)</Label>
              <Input
                id="potassium"
                type="number"
                placeholder="200"
                value={soilData.potassium || ''}
                onChange={(e) => setSoilData({ ...soilData, potassium: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organic_matter">Organic Matter (%)</Label>
              <Input
                id="organic_matter"
                type="number"
                step="0.1"
                placeholder="3.5"
                value={soilData.organic_matter || ''}
                onChange={(e) => setSoilData({ ...soilData, organic_matter: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="moisture">Moisture (%)</Label>
              <Input
                id="moisture"
                type="number"
                placeholder="55"
                value={soilData.moisture || ''}
                onChange={(e) => setSoilData({ ...soilData, moisture: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !soilData.ph}
            className="w-full md:w-auto"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Soil"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {hasResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Soil Health Analysis</CardTitle>
              <CardDescription>Current nutrient levels and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* pH Level */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">pH Level</span>
                    <Badge variant={getStatus(soilData.ph, [6.0, 7.5]) === 'optimal' ? 'default' : 'secondary'}>
                      {soilData.ph.toFixed(1)}
                    </Badge>
                  </div>
                  <Progress value={(soilData.ph / 14) * 100} className="h-2" />
                  <div className={`flex items-center space-x-1 text-sm ${getStatusColor(getStatus(soilData.ph, [6.0, 7.5]))}`}>
                    {getStatusIcon(getStatus(soilData.ph, [6.0, 7.5]))}
                    <span>{getStatus(soilData.ph, [6.0, 7.5]) === 'optimal' ? 'Optimal' : getStatus(soilData.ph, [6.0, 7.5]) === 'low' ? 'Too Acidic' : 'Too Alkaline'}</span>
                  </div>
                </div>

                {/* Nitrogen */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Nitrogen</span>
                    <Badge variant={getStatus(soilData.nitrogen, [20, 40]) === 'optimal' ? 'default' : 'secondary'}>
                      {soilData.nitrogen} ppm
                    </Badge>
                  </div>
                  <Progress value={Math.min((soilData.nitrogen / 50) * 100, 100)} className="h-2" />
                  <div className={`flex items-center space-x-1 text-sm ${getStatusColor(getStatus(soilData.nitrogen, [20, 40]))}`}>
                    {getStatusIcon(getStatus(soilData.nitrogen, [20, 40]))}
                    <span>{getStatus(soilData.nitrogen, [20, 40]) === 'optimal' ? 'Optimal' : getStatus(soilData.nitrogen, [20, 40])}</span>
                  </div>
                </div>

                {/* Phosphorus */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Phosphorus</span>
                    <Badge variant={getStatus(soilData.phosphorus, [15, 30]) === 'optimal' ? 'default' : 'secondary'}>
                      {soilData.phosphorus} ppm
                    </Badge>
                  </div>
                  <Progress value={Math.min((soilData.phosphorus / 40) * 100, 100)} className="h-2" />
                  <div className={`flex items-center space-x-1 text-sm ${getStatusColor(getStatus(soilData.phosphorus, [15, 30]))}`}>
                    {getStatusIcon(getStatus(soilData.phosphorus, [15, 30]))}
                    <span>{getStatus(soilData.phosphorus, [15, 30]) === 'optimal' ? 'Optimal' : getStatus(soilData.phosphorus, [15, 30])}</span>
                  </div>
                </div>

                {/* Potassium */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Potassium</span>
                    <Badge variant={getStatus(soilData.potassium, [150, 300]) === 'optimal' ? 'default' : 'secondary'}>
                      {soilData.potassium} ppm
                    </Badge>
                  </div>
                  <Progress value={Math.min((soilData.potassium / 400) * 100, 100)} className="h-2" />
                  <div className={`flex items-center space-x-1 text-sm ${getStatusColor(getStatus(soilData.potassium, [150, 300]))}`}>
                    {getStatusIcon(getStatus(soilData.potassium, [150, 300]))}
                    <span>{getStatus(soilData.potassium, [150, 300]) === 'optimal' ? 'Optimal' : getStatus(soilData.potassium, [150, 300])}</span>
                  </div>
                </div>

                {/* Organic Matter */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Organic Matter</span>
                    <Badge variant={getStatus(soilData.organic_matter, [2.5, 5.0]) === 'optimal' ? 'default' : 'secondary'}>
                      {soilData.organic_matter}%
                    </Badge>
                  </div>
                  <Progress value={Math.min((soilData.organic_matter / 6) * 100, 100)} className="h-2" />
                  <div className={`flex items-center space-x-1 text-sm ${getStatusColor(getStatus(soilData.organic_matter, [2.5, 5.0]))}`}>
                    {getStatusIcon(getStatus(soilData.organic_matter, [2.5, 5.0]))}
                    <span>{getStatus(soilData.organic_matter, [2.5, 5.0]) === 'optimal' ? 'Optimal' : getStatus(soilData.organic_matter, [2.5, 5.0])}</span>
                  </div>
                </div>

                {/* Moisture */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Moisture</span>
                    <Badge variant={getStatus(soilData.moisture, [40, 70]) === 'optimal' ? 'default' : 'secondary'}>
                      {soilData.moisture}%
                    </Badge>
                  </div>
                  <Progress value={soilData.moisture} className="h-2" />
                  <div className={`flex items-center space-x-1 text-sm ${getStatusColor(getStatus(soilData.moisture, [40, 70]))}`}>
                    {getStatusIcon(getStatus(soilData.moisture, [40, 70]))}
                    <span>{getStatus(soilData.moisture, [40, 70]) === 'optimal' ? 'Optimal' : getStatus(soilData.moisture, [40, 70])}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-600" />
                <span>AI Recommendations</span>
              </CardTitle>
              <CardDescription>
                Personalized suggestions to improve your soil health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecommendations().map((rec, index) => (
                  <Alert key={index}>
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 ${getStatusColor(rec.status)}`}>
                        {rec.icon}
                      </div>
                      <div className="flex-1">
                        <AlertDescription>
                          <span className="font-medium">{rec.nutrient}:</span> {rec.action}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
                
                {getRecommendations().length === 0 && (
                  <Alert>
                    <CheckCircle className="w-4 h-4" />
                    <AlertDescription>
                      <span className="font-medium">Excellent!</span> Your soil health is optimal. Continue with your current management practices and regular monitoring.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}