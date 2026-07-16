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
    <div className="w-full min-h-screen bg-background text-foreground scroll-smooth">
      <Navbar />

      {/* Section 1: Hero Section */}
      <div className="w-full min-h-screen relative flex items-center justify-center">
        <HeroSection />
      </div>

      {/* Section 2: Platform Stats & Impact */}
      <div className="w-full min-h-screen relative flex items-center justify-center">
        <StatsSection />
      </div>

      {/* Section 3: How It Works Onboarding & Footer */}
      <div className="w-full min-h-screen flex flex-col justify-between bg-gradient-to-b from-secondary/30 to-background">
        <div className="flex-1 flex items-center justify-center py-10">
          <HowItWorks />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
