import { useState, useEffect } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type LoginState = 'email' | 'otp';

const Login = () => {
  const [state, setState] = useState<LoginState>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleSendOTP = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setState('otp');
        setResendCountdown(60);
        toast({
          title: "OTP sent!",
          description: "Check your email for the verification code",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
      });

      if (error) {
        toast({
          title: "Invalid code",
          description: "Please check your code and try again",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "You've been logged in successfully",
        });
        navigate('/app');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    if (resendCountdown === 0) {
      handleSendOTP();
    }
  };

  const handleBack = () => {
    setState('email');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gradient-sunset flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center shadow-glow">
              <Mail className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Login
            </h1>
          </div>
          <p className="text-foreground/70">
            {state === 'email' 
              ? "Enter your email to receive a verification code"
              : "Enter the 6-digit code sent to your email"
            }
          </p>
        </div>

        <Card className="p-6 space-y-6 shadow-warm bg-card/95 backdrop-blur-sm border-primary/20">
          {state === 'email' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base transition-all duration-300 focus:scale-[1.02]"
                  onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
                />
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading || !email}
                className="w-full h-12 text-base font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
                variant="hero"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="p-0 h-auto hover:bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <span className="text-foreground/60">•</span>
                <span className="truncate">{email}</span>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Verification Code
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-12 h-12 text-lg transition-all duration-200 hover:border-primary/60 focus:scale-105"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-12 text-base font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-glow"
                  variant="hero"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </div>
                  ) : (
                    "Verify & Login"
                  )}
                </Button>

                <Button
                  onClick={handleResendOTP}
                  disabled={resendCountdown > 0}
                  variant="ghost"
                  className="w-full h-10 text-sm transition-all duration-300 hover:bg-primary/10"
                >
                  {resendCountdown > 0 ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Resend in {resendCountdown}s
                    </span>
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;