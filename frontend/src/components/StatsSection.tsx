import { Users, Building2, Sparkles } from "lucide-react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";

const stats = [
  { icon: Users, label: "Interns Registered", value: "2,400+" },
  { icon: Building2, label: "Partner Companies", value: "150+" },
  { icon: Sparkles, label: "Placements Made", value: "800+" },
];

const StatsSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full py-24 flex flex-col justify-center items-center overflow-hidden bg-background group/section"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(45,212,191,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Interactive spotlight cursor halo */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, rgba(20,184,166,0.06), transparent 80%)`,
        }}
      />

      {/* Decorative Animated Blur Accents & Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1 */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/10 blur-[120px] opacity-60"
        />
        {/* Blob 2 */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 80, -40, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-[-10%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[120px] opacity-60"
        />
        {/* Blob 3 */}
        <motion.div
          animate={{
            y: [-30, 30, -30],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[100px] opacity-40"
        />

        {/* Floating Wireframe Rings and Shapes */}
        <motion.div
          animate={{
            y: [-15, 15, -15],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[20%] left-[6%] w-12 h-12 text-primary/10 border border-primary/20 rounded-full flex items-center justify-center pointer-events-none"
        >
          <div className="w-8 h-8 rounded-full border border-dashed border-primary/10" />
        </motion.div>

        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-[20%] right-[6%] w-14 h-14 text-accent/10 border border-dashed border-accent/20 rounded-lg flex items-center justify-center pointer-events-none"
        >
          <div className="w-6 h-6 rounded-full border border-accent/10 rotate-45" />
        </motion.div>

        {/* Floating Particles */}
        {[
          { left: '12%', top: '25%', delay: 0, duration: 9, x: 15, y: -50, color: 'bg-primary/30' },
          { left: '85%', top: '30%', delay: 2, duration: 12, x: -25, y: -70, color: 'bg-accent/30' },
          { left: '20%', top: '70%', delay: 1, duration: 8, x: 20, y: -60, color: 'bg-accent/30' },
          { left: '75%', top: '80%', delay: 3, duration: 11, x: -20, y: -80, color: 'bg-primary/30' },
          { left: '48%', top: '15%', delay: 4, duration: 13, x: 25, y: -50, color: 'bg-primary/20' }
        ].map((pt, idx) => (
          <motion.div
            key={idx}
            animate={{
              x: [0, pt.x, 0],
              y: [0, pt.y, 0],
              opacity: [0.08, 0.45, 0.08],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: pt.duration,
              delay: pt.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute w-1.5 h-1.5 rounded-full ${pt.color} blur-[0.5px]`}
            style={{ left: pt.left, top: pt.top }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-5xl relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="font-sora text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            Our Platform <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-poppins leading-relaxed">
            Connecting high-potential candidates with forward-thinking organisations across the country.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="flex flex-col items-center p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 backdrop-blur-md shadow-card hover:shadow-primary/5 transition-all duration-300 text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/30 flex items-center justify-center mb-6 shrink-0 shadow-inner group-hover:scale-110 group-hover:bg-gradient-hero transition-all duration-300">
                <stat.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-sora font-extrabold text-4xl md:text-5xl text-foreground mb-2 tracking-tight group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </h3>
              <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Highlights / Trust Checklist elements */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 flex flex-wrap justify-center gap-6 max-w-4xl mx-auto border-t border-white/5 pt-10"
        >
          {[
            "Pre-vetted Candidates",
            "End-to-End Match Support",
            "No Hidden Platform Fees"
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.03] transition-all duration-300 text-muted-foreground hover:text-foreground text-sm font-poppins shadow-sm"
            >
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                ✓
              </div>
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
