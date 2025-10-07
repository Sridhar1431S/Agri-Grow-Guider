import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Sprout, LogIn, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { RainAnimation } from '@/components/RainAnimation';
import heroImage from '@/assets/hero-agriculture.jpg';

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const { toast } = useToast();

  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!otpStep) return;
    setResendTimer(30);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = window.setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [otpStep]);

  // Redirect if already authenticated (after all hooks are called)
  if (user && !loading) {
    return <Navigate to="/" replace />;
  }
  const handleEmailOtpSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false
      }
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setUserEmail(email);
      setOtpStep(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code.",
      });
    }
    setIsLoading(false);
  };

  const handlePasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const language = formData.get('language') as string;
    
    await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      preferred_language: language
    });
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Reset Link Sent",
        description: "Please check your email for the password reset link.",
      });
      setForgotPasswordStep(false);
    }
    setIsLoading(false);
  };



  const handleOtpVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: userEmail,
      token: otp,
      type: 'email'
    });

    if (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success!",
        description: "You have been signed in successfully.",
      });
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || !userEmail) return;
    setIsResending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: userEmail,
      options: { shouldCreateUser: false }
    });

    if (error) {
      toast({
        title: "Resend Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "OTP Sent",
        description: `We re-sent a code to ${userEmail}.`,
      });
      setResendTimer(30);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      intervalRef.current = window.setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    setIsResending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-growth">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (forgotPasswordStep) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <RainAnimation />
        <div className="w-full max-w-md relative z-10">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-white mr-2" />
              <h1 className="text-2xl font-bold text-white">Agri Grow</h1>
            </div>
            <p className="text-white/80">Reset your password</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/95 border-white/20">
            <CardHeader className="text-center">
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>Enter your email to receive a reset link</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    name="email"
                    type="email"
                    placeholder="farmer@example.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setForgotPasswordStep(false)}
                >
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (otpStep) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <RainAnimation />
        <div className="w-full max-w-md relative z-10">
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-white mr-2" />
              <h1 className="text-2xl font-bold text-white">Agri Grow</h1>
            </div>
            <p className="text-white/80">Enter verification code</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/95 border-white/20">
            <CardHeader className="text-center">
              <CardTitle>Verify Email</CardTitle>
              <CardDescription>Enter the 6-digit code sent to {userEmail}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendOtp}
                  disabled={isResending || resendTimer > 0}
                >
                  {isResending ? "Resending..." : resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setOtpStep(false)}
                >
                  Back to Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-black/50" />
      <RainAnimation />
      <div className="w-full max-w-md relative z-10">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center text-white hover:text-white/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Sprout className="w-8 h-8 text-white mr-2" />
            <h1 className="text-2xl font-bold text-white">Agri Grow</h1>
          </div>
          <p className="text-white/80">Smart farming for better yields</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-white/20">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Agri Grow</CardTitle>
            <CardDescription>Sign in to access your farming dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="password" className="flex items-center text-xs">
                  <LogIn className="w-3 h-3 mr-1" />
                  Password
                </TabsTrigger>
                <TabsTrigger value="otp" className="flex items-center text-xs">
                  <LogIn className="w-3 h-3 mr-1" />
                  Email OTP
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center text-xs">
                  <UserPlus className="w-3 h-3 mr-1" />
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-4 mt-6">
                <form onSubmit={handlePasswordSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-signin-email">Email</Label>
                    <Input
                      id="password-signin-email"
                      name="email"
                      type="email"
                      placeholder="farmer@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password-signin-password"
                        name="password"
                        type={showSignInPassword ? "text" : "password"}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="w-full" 
                    onClick={() => setForgotPasswordStep(true)}
                  >
                    Forgot Password?
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp" className="space-y-4 mt-6">
                <form onSubmit={handleEmailOtpSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-signin-email">Email</Label>
                    <Input
                      id="otp-signin-email"
                      name="email"
                      type="email"
                      placeholder="farmer@example.com"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Ram"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Kumar"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="farmer@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        name="password"
                        type={showSignUpPassword ? "text" : "password"}
                        minLength={6}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select name="language" defaultValue="en">
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <Separator className="my-6" />
            
            <div className="text-center text-sm text-muted-foreground">
              <p>By signing up, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}