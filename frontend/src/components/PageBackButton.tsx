import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface PageBackButtonProps {
  label?: string;
  fallbackTo?: string;
  className?: string;
}

const PageBackButton = ({ label = "Back", fallbackTo, className = "" }: PageBackButtonProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackTo || (isAdmin ? "/admin" : "/profile"));
  };

  return (
    <Button variant="ghost" onClick={handleBack} className={`gap-2 ${className}`.trim()}>
      <ArrowLeft className="w-4 h-4" /> {label}
    </Button>
  );
};

export default PageBackButton;
