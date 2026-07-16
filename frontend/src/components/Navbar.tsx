import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Briefcase, LogOut, Settings, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-hero flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-foreground transition-all duration-300">
            Intern<span className="bg-gradient-hero bg-clip-text text-transparent">Link</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/jobs">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Search className="w-4 h-4" /> Jobs
            </Button>
          </Link>

          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/5 text-primary">
                    <Settings className="w-4 h-4" /> Admin
                  </Button>
                </Link>
              ) : (
                <Link to="/my-applications">
                  <Button variant="outline" size="sm">My Applications</Button>
                </Link>
              )}

              {!isAdmin && (
                <Link to="/profile">
                  <Button variant="outline" size="sm">My Profile</Button>
                </Link>
              )}

              <Button variant="ghost" size="sm" onClick={signOut} className="gap-1.5">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm">Join as Intern</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
