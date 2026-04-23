import { Briefcase } from "lucide-react";

const Footer = () => (
  <footer className="py-10 border-t border-border bg-card">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-display font-bold text-foreground">InternLink</span>
      </div>
      <p className="text-sm text-muted-foreground">(c) 2026 InternLink. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
