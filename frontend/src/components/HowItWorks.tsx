import { useState } from "react";
import { UserPlus, FileText, Handshake } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
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
  const [activeStep, setActiveStep] = useState(0);
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
      className="relative w-full py-20 overflow-hidden bg-background group/section"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Interactive spotlight cursor halo */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(450px circle at ${mouseX}px ${mouseY}px, rgba(14,165,233,0.06), transparent 80%)`,
        }}
      />

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

        {/* Floating Wireframe Rings and Shapes */}
        <motion.div
          animate={{
            y: [15, -15, 15],
            rotate: [360, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[25%] right-[6%] w-12 h-12 text-accent/10 border border-accent/20 rounded-full flex items-center justify-center pointer-events-none"
        >
          <div className="w-8 h-8 rounded-full border border-dashed border-accent/10" />
        </motion.div>

        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-[25%] left-[6%] w-14 h-14 text-primary/10 border border-dashed border-primary/20 rounded-lg flex items-center justify-center pointer-events-none"
        >
          <div className="w-6 h-6 rounded-full border border-primary/10 rotate-45" />
        </motion.div>

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

        {/* Responsive Grid Layout */}
        <div className="grid md:grid-cols-5 gap-12 items-center">
          {/* Left Column: Steps List (Span 2) */}
          <div className="md:col-span-2 col-span-5 space-y-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                onMouseEnter={() => setActiveStep(i)}
                onClick={() => setActiveStep(i)}
                className={`relative p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 select-none ${
                  activeStep === i
                    ? "bg-white/[0.04] border-primary shadow-lg shadow-primary/5"
                    : "bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                }`}
              >
                {/* Connector line for active state */}
                {activeStep === i && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-hero rounded-r-md"
                  />
                )}
                
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeStep === i
                      ? "bg-gradient-hero text-white shadow-md shadow-primary/20"
                      : "bg-white/5 text-muted-foreground"
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className={`font-sora text-lg font-bold transition-colors duration-300 ${
                    activeStep === i ? "text-primary" : "text-foreground"
                  }`}>
                    {step.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm font-poppins leading-relaxed pl-14">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Dynamic Preview Window (Span 3) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-3 col-span-5 w-full"
          >
            <div className="bg-[#030712]/50 border border-white/5 rounded-3xl w-full h-[380px] p-8 backdrop-blur-md shadow-card relative flex flex-col justify-between overflow-hidden">
              {/* Browser Window Header Dots */}
              <div className="flex gap-1.5 absolute top-5 left-5 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>

              {/* Dynamic Content */}
              <div className="w-full h-full pt-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {activeStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full justify-between pt-4 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">RS</div>
                          <div>
                            <p className="text-sm font-bold text-foreground leading-none">Rahul Sharma</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Frontend Developer</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">Active</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-poppins">
                            <span>Profile Completion</span>
                            <span className="font-semibold text-primary">100%</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-hero"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Expertise Tags</p>
                          <div className="flex flex-wrap gap-1.5">
                            {["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"].map((tag, idx) => (
                              <motion.span
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.08, duration: 0.25 }}
                                className="text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-foreground"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-white/5 pt-4 mt-2">
                        <span className="text-xs text-muted-foreground font-poppins">Resume Uploaded: <span className="text-primary font-semibold font-poppins">rahul_resume.pdf ✓</span></span>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full justify-between pt-4 relative overflow-hidden text-left"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <p className="text-sm font-bold text-foreground">Smart Match Results</p>
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                          </span>
                        </div>

                        <div className="space-y-3">
                          {[
                            { company: "Vercel", role: "Frontend Intern", match: "98%", border: "border-primary/20" },
                            { company: "Stripe", role: "Software Engineer Intern", match: "95%", border: "border-white/5" }
                          ].map((job, idx) => (
                            <motion.div
                              key={job.company}
                              initial={{ x: 30, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.12 }}
                              className={`p-4 rounded-xl bg-white/5 border ${job.border} flex items-center justify-between`}
                            >
                              <div>
                                <p className="text-xs font-bold text-foreground">{job.role}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{job.company}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{job.match} Match</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Scanning radar line */}
                      <motion.div
                        animate={{ top: ['15%', '85%', '15%'] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 pointer-events-none"
                      />

                      <div className="border-t border-white/5 pt-4 mt-2">
                        <span className="text-xs text-muted-foreground font-poppins">Matching Engine status: <span className="text-accent font-semibold font-poppins">Scanning Roles...</span></span>
                      </div>
                    </motion.div>
                  )}

                  {activeStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full justify-between items-center text-center pt-6 px-4"
                    >
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 shadow-inner border border-primary/20">
                        <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>🎉</span>
                      </div>
                      
                      <div>
                        <h5 className="text-base font-bold text-foreground">Offer Letter Received!</h5>
                        <p className="text-xs text-muted-foreground mt-1.5 max-w-[280px] leading-relaxed font-poppins">
                          Congratulations! Vercel has offered you the role of <strong>Frontend Intern</strong> starting next month.
                        </p>
                      </div>

                      <div className="w-full grid grid-cols-2 gap-3 mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="py-2.5 bg-gradient-hero text-white text-xs font-bold rounded-xl shadow-md shadow-primary/20 hover:brightness-110 transition-all duration-300"
                        >
                          Accept Offer
                        </motion.button>
                        <button className="py-2.5 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground text-xs font-semibold rounded-xl border border-white/5 transition-all duration-300">
                          Decline
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
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
