import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays, MapPin, Building2 } from "lucide-react";

interface ApplicationItem {
  id: string;
  jobId: string;
  applicationStatus: string;
  appliedAt: string;
  coverLetter: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    deadline: string | null;
    status: string;
  } | null;
}

const statusStyles: Record<string, string> = {
  submitted: "bg-primary/10 text-primary border-primary/20",
  shortlisted: "bg-accent/10 text-accent border-accent/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const MyApplications = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!authLoading && isAdmin) {
      navigate("/admin");
      return;
    }
    if (user) {
      void loadApplications();
    }
  }, [user, authLoading, navigate, isAdmin]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.get("/api/applications/me");
      setApplications((data.applications || []) as ApplicationItem[]);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">My Applications</h1>
            <p className="text-muted-foreground mb-8">Track where you stand in every job you applied for.</p>
          </motion.div>

          <div className="space-y-5">
            {applications.map((application) => (
              <Card key={application.id} className="rounded-2xl border-border shadow-card">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle className="font-display text-xl">{application.job?.title || "Job"}</CardTitle>
                    <Badge className={statusStyles[application.applicationStatus] || statusStyles.submitted}>{application.applicationStatus}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {application.job?.company || "Company"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {application.job?.location || "Not specified"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> Applied on {new Date(application.appliedAt).toLocaleDateString()}</p>

                  <div className="pt-2"><Link to={`/jobs/${application.jobId}`}><Button variant="outline" className="rounded-xl">View Job</Button></Link></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {applications.length === 0 && (
            <Card className="rounded-2xl border-border shadow-card">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">You have not applied to any jobs yet.</p>
                <Link to="/jobs"><Button className="rounded-xl">Browse Jobs</Button></Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyApplications;
