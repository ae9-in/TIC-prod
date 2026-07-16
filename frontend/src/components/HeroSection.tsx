import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Full-width/Full-height Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Diverse interns collaborating"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark and gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/85 z-10" />
      </div>

      {/* Decorative Blur Accents */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-20 left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-[-10%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Spinning Center Logo (Vinyl Badge Seal) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] pointer-events-none select-none opacity-90 flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full animate-spin-slow">
          <defs>
            {/* Circle path of radius 120 centered at (200, 200) */}
            <path
              id="badgeCirclePath"
              d="M 200, 200 m -120, 0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
            />
          </defs>
          <text
            className="font-sora font-extrabold uppercase tracking-[5.5px] fill-primary/25"
            fontSize="18"
          >
            <textPath href="#badgeCirclePath" startOffset="0%">
              • INTERNLINK • CONNECTING TALENT • INTERNLINK • CONNECTING TALENT 
            </textPath>
          </text>
        </svg>
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-20 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Connecting talent with opportunity
          </div>

          <h1 className="font-sora text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-white tracking-tight">
            Find the <span className="text-gradient">perfect intern</span> for your team
          </h1>

          <p className="font-poppins text-base sm:text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
            We connect companies with fresh, motivated interns. Register your profile, showcase your skills, and let companies discover you.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button
                size="lg"
                className="gap-2.5 text-base px-8 py-6 rounded-xl bg-primary hover:bg-primary/95 text-white font-semibold shadow-elevated transition-all duration-300 transform hover:scale-[1.03]"
              >
                Register Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
