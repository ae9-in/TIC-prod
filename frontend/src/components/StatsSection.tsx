import { Users, Building2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, label: "Interns Registered", value: "2,400+" },
  { icon: Building2, label: "Partner Companies", value: "150+" },
  { icon: Sparkles, label: "Placements Made", value: "800+" },
];

const StatsSection = () => {
  return (
    <section className="relative w-full h-full flex flex-col justify-center items-center bg-gradient-to-b from-background to-secondary/30 px-4 py-16">
      {/* Decorative Blur Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-sora text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            Our Platform <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Connecting high-potential candidates with forward-thinking organisations across the country.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="flex flex-col items-center p-8 rounded-2xl bg-card shadow-card border border-border text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shrink-0 shadow-sm">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-sora font-extrabold text-3xl md:text-4xl text-foreground mb-2">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
