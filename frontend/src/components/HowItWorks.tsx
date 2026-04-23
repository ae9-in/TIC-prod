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
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Three simple steps to your next internship
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-card rounded-2xl p-8 shadow-card border border-border text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-5">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute top-6 right-6 font-display text-4xl font-bold text-muted/80">
                {i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
