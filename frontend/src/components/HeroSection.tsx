import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-image.jpg";

const stats = [
  { icon: Users, label: "Interns Registered", value: "2,400+" },
  { icon: Building2, label: "Partner Companies", value: "150+" },
  { icon: Sparkles, label: "Placements Made", value: "800+" },
];

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-10 right-[10%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Connecting talent with opportunity
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
              Find the <span className="text-gradient">perfect intern</span> for your team
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              We connect companies with fresh, motivated interns. Register your profile, showcase your skills, and let companies discover you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2 text-base px-6">
                  Register Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-elevated">
              <img
                src={heroImage}
                alt="Diverse interns collaborating"
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid sm:grid-cols-3 gap-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-5 rounded-xl bg-card shadow-card border border-border"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-2xl text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
