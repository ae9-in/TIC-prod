import { UserPlus, FileText, Handshake } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="w-full py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-sora text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto font-poppins">
            Three simple steps to your next career-defining internship
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="relative bg-card rounded-2xl p-8 shadow-card border border-border text-center overflow-hidden"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-6 shadow-sm">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute top-4 right-6 font-sora text-4xl font-extrabold text-muted/50 select-none">
                {i + 1}
              </div>
              <h3 className="font-sora text-xl font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm font-poppins leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
