import { useState, useEffect } from "react";
import { Sparkles, Heart, Clock, Palette, LogIn, ArrowRight, Star, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import heroImage from "@/assets/hero-transformation.jpg";
import beforeImage from "@/assets/before-bw.jpg";
import afterImage from "@/assets/after-color.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-sunset">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-warm rounded-xl flex items-center justify-center shadow-glow">
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">RangMantra</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/login')}
            className="gap-2 transition-all duration-300 hover:scale-105"
          >
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Transform Your Memories with AI
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Bring Your
            <span className="bg-gradient-warm bg-clip-text text-transparent"> Black & White </span>
            Photos to Life
          </h1>
          
          <p className="text-lg sm:text-xl text-foreground/70 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in">
            Transform your precious vintage wedding photos and family memories into stunning colored masterpieces. 
            Perfect for bringing decades-old memories back to life with AI-powered colorization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              size="lg"
              variant="hero"
              onClick={() => navigate('/login')}
              className="gap-3 text-lg px-8 py-4 h-14 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow"
            >
              Experience for Free
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="text-sm text-foreground/60 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              No credit card required
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <Card className="overflow-hidden shadow-warm bg-card/95 backdrop-blur-sm border-primary/20">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Before</h3>
                <img 
                  src={beforeImage} 
                  alt="Original black and white wedding photo"
                  className="rounded-lg shadow-warm w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">After</h3>
                <img 
                  src={afterImage} 
                  alt="AI colorized wedding photo"
                  className="rounded-lg shadow-warm w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose RangMantra?
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Advanced AI technology meets intuitive design to deliver stunning results
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 text-center space-y-4 shadow-warm bg-card/95 backdrop-blur-sm border-primary/20 transition-transform duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto shadow-glow">
              <Zap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Lightning Fast</h3>
            <p className="text-foreground/70">
              Get your colorized photos in seconds, not hours. Our AI processes images instantly.
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
              Specially designed for wedding photos and family memories that matter most to you.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-8 sm:p-12 text-center space-y-6 shadow-warm bg-gradient-nostalgic/10 border-primary/20 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Ready to Transform Your Memories?
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Join thousands of families who have already brought their cherished black & white photos back to life.
          </p>
          <Button
            size="lg"
            variant="hero"
            onClick={() => navigate('/login')}
            className="gap-3 text-lg px-8 py-4 h-14 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow"
          >
            Start for Free
            <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-sm text-foreground/60">
            No sign-up fees • Instant results • Your memories, beautifully restored
          </p>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> to preserve and revive your precious memories
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;