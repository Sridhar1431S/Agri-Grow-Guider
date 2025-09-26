import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Settings, Sprout, ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Profile {
  first_name: string;
  last_name: string;
  farm_location: string;
  farm_size_acres: number | null;
  primary_crops: string[];
  phone: string;
  preferred_language: string;
}

export default function Profile() {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    farm_location: '',
    farm_size_acres: null,
    primary_crops: [],
    phone: '',
    preferred_language: 'en'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated
  if (!user && !loading) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive"
      });
    } else if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        farm_location: data.farm_location || '',
        farm_size_acres: data.farm_size_acres,
        primary_crops: data.primary_crops || [],
        phone: data.phone || '',
        preferred_language: data.preferred_language || 'en'
      });
    }
    setIsLoading(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Profile saved",
        description: "Your profile has been updated successfully.",
      });
    }
    setIsSaving(false);
  };

  const handleCropToggle = (crop: string) => {
    setProfile(prev => ({
      ...prev,
      primary_crops: prev.primary_crops.includes(crop)
        ? prev.primary_crops.filter(c => c !== crop)
        : [...prev.primary_crops, crop]
    }));
  };

  const availableCrops = ['rice', 'wheat', 'maize', 'sugarcane', 'cotton', 'soybean', 'groundnut', 'pulses'];

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-semibold">My Profile</h1>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal and farming information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.first_name}
                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.last_name}
                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select
                      value={profile.preferred_language}
                      onValueChange={(value) => setProfile({ ...profile, preferred_language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <Sprout className="w-5 h-5 mr-2 text-green-600" />
                      Farm Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farmLocation">Farm Location</Label>
                        <Input
                          id="farmLocation"
                          value={profile.farm_location}
                          onChange={(e) => setProfile({ ...profile, farm_location: e.target.value })}
                          placeholder="e.g., Bhubaneswar, Odisha"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="farmSize">Farm Size (acres)</Label>
                        <Input
                          id="farmSize"
                          type="number"
                          step="0.1"
                          value={profile.farm_size_acres || ''}
                          onChange={(e) => setProfile({ ...profile, farm_size_acres: parseFloat(e.target.value) || null })}
                          placeholder="e.g., 2.5"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Primary Crops</Label>
                      <div className="flex flex-wrap gap-2">
                        {availableCrops.map((crop) => (
                          <Badge
                            key={crop}
                            variant={profile.primary_crops.includes(crop) ? "default" : "outline"}
                            className="cursor-pointer capitalize"
                            onClick={() => handleCropToggle(crop)}
                          >
                            {crop}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Click to select/deselect your primary crops
                      </p>
                    </div>
                  </div>

                  <Button type="submit" disabled={isSaving} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Profile Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  {profile.farm_location && (
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{profile.farm_location}</p>
                    </div>
                  )}
                  
                  {profile.farm_size_acres && (
                    <div>
                      <p className="text-sm font-medium">Farm Size</p>
                      <p className="text-sm text-muted-foreground">{profile.farm_size_acres} acres</p>
                    </div>
                  )}
                  
                  {profile.primary_crops.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Primary Crops</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {profile.primary_crops.map((crop) => (
                          <Badge key={crop} variant="secondary" className="text-xs capitalize">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}