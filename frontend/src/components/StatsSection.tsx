import { Users, Building2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  { icon: Users, label: "Interns Registered", value: "2,400+" },
  { icon: Building2, label: "Partner Companies", value: "150+" },
  { icon: Sparkles, label: "Placements Made", value: "800+" },
];

const chartData = [
  { month: "Jan", Placements: 120, Interns: 400 },
  { month: "Feb", Placements: 210, Interns: 750 },
  { month: "Mar", Placements: 340, Interns: 1100 },
  { month: "Apr", Placements: 480, Interns: 1550 },
  { month: "May", Placements: 620, Interns: 1980 },
  { month: "Jun", Placements: 800, Interns: 2400 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg">
        <p className="font-sora font-semibold text-sm text-foreground mb-1">{payload[0].payload.month}</p>
        <p className="font-poppins text-xs text-primary flex items-center gap-1.5 font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Placements: <span className="font-bold">{payload[0].value}</span>
        </p>
        {payload[1] && (
          <p className="font-poppins text-xs text-accent flex items-center gap-1.5 mt-0.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Interns: <span className="font-bold">{payload[1].value}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const StatsSection = () => {
  return (
    <section className="relative w-full py-24 flex flex-col justify-center items-center overflow-hidden bg-background">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(45,212,191,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

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

        {/* Dynamic Analytics Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-4xl mx-auto p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-card text-left"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h4 className="font-sora font-extrabold text-xl md:text-2xl text-foreground">
                Placement & Growth Trends
              </h4>
              <p className="text-muted-foreground text-sm font-poppins mt-1">
                Real-time tracking of successful internship matches and user registrations.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs font-semibold font-poppins text-primary">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Placements
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold font-poppins text-accent">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Interns
              </span>
            </div>
          </div>

          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInterns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={11} fontFamily="var(--font-body)" />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={11} fontFamily="var(--font-body)" />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Placements" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorPlacements)" />
                <Area type="monotone" dataKey="Interns" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorInterns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

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

