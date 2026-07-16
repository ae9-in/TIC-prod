import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden py-24">
      {/* Background Video with optimized dark overlay gradient for readability */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-business-people-working-together-in-an-office-4334-large.mp4"
            type="video/mp4"
          />
          {/* Fallback image */}
          <img
            src={heroImage}
            alt="Diverse interns collaborating"
            className="w-full h-full object-cover object-center"
          />
        </video>
        {/* Soft, rich dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/85 z-10" />
      </div>

      {/* Decorative Blur Accents */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-20 left-[-10%] w-[350px] h-[350px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-[-10%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-20 text-center max-w-4xl flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          {/* Central Glossy Brand Pill with Clean Text */}
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-primary/30 text-white backdrop-blur-md shadow-lg shadow-black/30 mb-10 transition-all duration-300 select-none group cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-poppins font-bold text-sm tracking-[4px] uppercase leading-none bg-gradient-hero bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300">
              INTERN LINK
            </span>
          </motion.div>

          {/* Heading */}
          <h1 className="font-sora text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 text-white tracking-tight">
            Find the <span className="text-gradient">perfect intern</span> for your team
          </h1>

          {/* Subtext */}
          <p className="font-poppins text-base sm:text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
            We connect companies with fresh, motivated interns. Register your profile, showcase your skills, and let companies discover you.
          </p>

          {/* Call to Action Button */}
          <div className="flex justify-center">
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
