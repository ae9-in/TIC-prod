import { Briefcase } from "lucide-react";

const Footer = () => (
  <footer className="py-10 border-t border-border bg-card">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 group cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 transition-all duration-300">
          <Briefcase className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-foreground">
          Intern<span className="bg-gradient-hero bg-clip-text text-transparent">Link</span>
        </span>
      </div>
      <p className="text-sm text-muted-foreground">(c) 2026 InternLink. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
