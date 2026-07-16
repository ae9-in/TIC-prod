import { UserPlus, FileText, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Sign up and fill in your skills, education, experience, and upload your resume.",
  },
  {
    icon: FileText,
    title: "Get Matched",
    description: "Our team reviews your profile and matches you with suitable companies looking for interns.",
  },
  {
    icon: Handshake,
    title: "Land Your Internship",
    description: "Connect with companies, interview, and kick-start your career with real-world experience.",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-background">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Decorative Animated Blur Accents & Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blob 1 */}
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 40, -50, 0],
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-[-10%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[120px] opacity-60"
        />
        {/* Blob 2 */}
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -70, 50, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/3 left-[-10%] w-[450px] h-[450px] rounded-full bg-primary/10 blur-[120px] opacity-60"
        />
        {/* Blob 3 */}
        <motion.div
          animate={{
            x: [-40, 40, -40],
            y: [30, -30, 30],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 right-1/4 w-[250px] h-[250px] rounded-full bg-accent/5 blur-[90px] opacity-50"
        />

        {/* Floating Particles */}
        {[
          { left: '8%', top: '35%', delay: 1, duration: 10, x: 20, y: -70, color: 'bg-accent/30' },
          { left: '78%', top: '20%', delay: 3, duration: 13, x: -15, y: -50, color: 'bg-primary/30' },
          { left: '22%', top: '80%', delay: 0.5, duration: 8, x: -25, y: -80, color: 'bg-primary/30' },
          { left: '88%', top: '75%', delay: 2.5, duration: 11, x: 20, y: -60, color: 'bg-accent/30' },
          { left: '50%', top: '85%', delay: 1.5, duration: 12, x: -10, y: -90, color: 'bg-accent/20' }
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

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="font-sora text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto font-poppins leading-relaxed">
            Three simple steps to your next career-defining internship
          </p>
        </motion.div>

        {/* Desktop timeline connector and cards */}
        <div className="relative">
          {/* Horizontal connecting line with animated light pulse */}
          <div className="absolute top-[60px] left-[15%] right-[15%] h-[2px] hidden md:block z-0 overflow-hidden rounded-full">
            <div className="w-full h-full bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 relative">
              <motion.div
                initial={{ left: "-20%" }}
                animate={{ left: "120%" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-0 bottom-0 w-[100px] bg-gradient-to-r from-transparent via-primary/80 to-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative bg-white/[0.02] border border-white/5 hover:border-primary/20 backdrop-blur-md rounded-2xl p-8 shadow-card hover:shadow-primary/5 transition-all duration-300 text-center overflow-hidden group"
              >
                {/* Background Number Accent */}
                <div className="absolute top-4 right-6 font-sora text-5xl font-extrabold text-white/5 select-none group-hover:text-primary/10 group-hover:scale-110 transition-all duration-500">
                  0{i + 1}
                </div>

                {/* Icon Container with animated background glow */}
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-6 shadow-md shadow-primary/20 relative z-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                <h3 className="font-sora text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm font-poppins leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Link to Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <Link to="/jobs">
            <Button
              size="lg"
              className="rounded-xl px-8 py-6 bg-gradient-hero hover:opacity-95 text-white font-bold shadow-elevated transition-all duration-300 transform hover:scale-[1.03] group gap-2"
            >
              Browse Open Roles
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
