import { ArrowRight, Camera, Clock, Heart, LogIn, Palette, Shield, Sparkles, Star, Users, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PhotoCollage } from "@/components/PhotoCollage";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { StatsAPI, StatsResponse } from "@/services/statsApi";

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<StatsResponse>({
    total_users: 9, // Default fallback values matching current DB
    total_memories: 34,
    last_updated: new Date().toISOString()
  });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/app');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/app');
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch real-time stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const realStats = await StatsAPI.getStats();
        setStats(realStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Keep fallback values if API fails
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-gradient-sunset">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gradient-warm rounded-xl flex items-center justify-center shadow-glow">
              <Palette className="w-5 h-5 text-primary-foreground" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shadow-sm">
                <Camera className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h1 className="text-2xl sm:text-3xl font-bold leading-none">YaadonKe<span className="bg-gradient-to-r from-orange-800 via-red-700 to-red-800 bg-clip-text text-transparent">Rang</span></h1>
              <a 
                href="https://indrasol.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 leading-none mb-0.5"
              >
                by Indrasol
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Stats Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-base sm:text-lg md:text-xl font-bold text-foreground leading-none">
                  {StatsAPI.formatNumber(stats.total_users)}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-foreground/70 leading-tight font-bold">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 stroke-2" />
                  <span className="hidden xs:inline sm:hidden md:inline">Happy Users</span>
                  <span className="xs:hidden sm:inline md:hidden">Users</span>
                </div>
              </div>
              
              <div className="w-px h-6 sm:h-8 bg-border/50"></div>
              
              <div className="text-center">
                <div className="text-base sm:text-lg md:text-xl font-bold text-foreground leading-none">
                  {StatsAPI.formatNumber(stats.total_memories)}
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-foreground/70 leading-tight font-bold">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 stroke-2" />
                  <span className="hidden xs:inline sm:hidden md:inline">Memories Revived</span>
                  <span className="xs:hidden sm:inline md:hidden">Memories</span>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="gap-2 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split Screen Design */}
      <section className="flex flex-col">
        {/* Header Content */}
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 leading-tight animate-fade-in">
              Bring Your
              <span className="text-muted-foreground"> Black & White </span>
              Photos to Life
            </h1>
            <p className="text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-foreground/80 font-medium animate-fade-in">
              Transform your precious vintage wedding photos and family memories into stunning colored masterpieces — bringing decades-old memories back to life.
            </p>
            <div className="h-6 sm:h-8" />
            
            {/* Privacy Card */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button
                size="lg"
                variant="hero"
                onClick={() => navigate('/login')}
                className="gap-3 text-lg px-8 py-4 h-14 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow"
              >
                Experience for Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Split Screen Photo Collage */}
        {/* Remove fixed height so the collage determines its own height */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Side - Black & White */}
          <div className="bg-gray-900 flex flex-col animate-slide-in-left">
            <div className="p-4 sm:p-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Before</h2>
              <p className="text-gray-300 text-sm sm:text-base">Your precious memories in black & white</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <PhotoCollage variant="bw" layout="masonry" className="h-full animate-scale-in" />
            </div>
          </div>

          {/* Right Side - Color */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 flex flex-col animate-slide-in-right">
            <div className="p-4 sm:p-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">After</h2>
              <p className="text-orange-100 text-sm sm:text-base">Brought back to life with vibrant colors</p>
            </div>
            <div className="flex-1 overflow-hidden">
              <PhotoCollage variant="color" layout="masonry" className="h-full animate-scale-in" />
            </div>
          </div>
        </div>
        <div className="h-8 md:h-12" />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 text-center space-y-4 shadow-warm bg-card/95 backdrop-blur-sm border-primary/20 transition-transform duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Lightning Fast</h3>
            <p className="text-foreground/70">
              Get your colorized photos in seconds, not hours
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 shadow-warm bg-card/95 backdrop-blur-sm border-primary/20 transition-transform duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-nostalgic rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <Star className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Premium Quality</h3>
            <p className="text-foreground/70">
              Museum-quality colorization that preserves the emotion and authenticity of your memories.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 shadow-warm bg-card/95 backdrop-blur-sm border-primary/20 transition-transform duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <Heart className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Made with Love</h3>
            <p className="text-foreground/70">
              Specially to add color to your vintage and old wedding photos and family memories that matter most to you.
            </p>
          </Card>

          {/* Privacy Card */}
          <Card className="p-6 text-center space-y-4 shadow-warm bg-card/95 backdrop-blur-sm border-primary/20 transition-transform duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Privacy First</h3>
            <p className="text-foreground/70">
              We never store your photos. Everything is processed securely and deleted immediately.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-8 sm:p-12 text-center space-y-6 shadow-warm bg-gradient-nostalgic/10 border-primary/20 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Ready to Add Color to Your Memories?
          </h2>
          <Button
            size="lg"
            variant="hero"
            onClick={() => navigate('/login')}
            className="gap-3 text-lg px-8 py-4 h-14 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow"
          >
            Add Color to your Memory
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-sm sm:text-base leading-relaxed text-foreground/80 font-medium">
            Instant results • Your memories, beautifully restored
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="text-center">
          <p className="text-sm sm:text-base leading-relaxed text-foreground/80 font-medium">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> to preserve and revive your precious memories
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;