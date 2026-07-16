import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  }, [user, loading, navigate, isAdmin]);

  if (loading) return null;

  return (
    <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-background">
      <Navbar />

      {/* Slide 1: Hero Section */}
      <div className="w-full h-screen snap-start shrink-0 relative">
        <HeroSection />
      </div>

      {/* Slide 2: Platform Stats & Impact */}
      <div className="w-full h-screen snap-start shrink-0 relative">
        <StatsSection />
      </div>

      {/* Slide 3: How It Works Onboarding & Footer */}
      <div className="w-full h-screen snap-start shrink-0 flex flex-col justify-between bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <HowItWorks />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
