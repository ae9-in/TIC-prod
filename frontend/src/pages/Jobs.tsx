import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackButton from "@/components/PageBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, CalendarDays, Building2 } from "lucide-react";

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  description: string;
  skills: string[];
  deadline: string | null;
}

interface MyApp {
  id: string;
  jobId: string;
}

const Jobs = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      void loadJobs();
    }
  }, [user?.id, authLoading, navigate]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([api.get("/api/jobs"), api.get("/api/applications/me")]);
      setJobs((jobsData.jobs || []) as JobItem[]);
      setAppliedJobIds(new Set(((appsData.applications || []) as MyApp[]).map((a) => a.jobId)));
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        (job.skills || []).some((skill) => skill.toLowerCase().includes(q)),
    );
  }, [jobs, search]);

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
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <PageBackButton label="Back" fallbackTo={isAdmin ? "/admin" : "/profile"} className="mb-3 -ml-3" />
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">Open Roles</h1>
            <p className="text-muted-foreground">Explore current opportunities and apply in a few clicks.</p>
          </motion.div>

          <div className="mb-8">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by role, company, location, or skill" className="h-11 rounded-xl" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map((job) => {
              const isApplied = appliedJobIds.has(job.id);
              return (
                <Card key={job.id} className="rounded-2xl border-border shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="font-display text-xl">{job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company}</p>
                      </div>
                      <Badge variant="secondary" className="capitalize">{job.employmentType}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || "Not specified"}</span>
                      <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />{job.deadline ? `Apply by ${new Date(job.deadline).toLocaleDateString()}` : "Open until filled"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                    <div className="flex flex-wrap gap-2">{(job.skills || []).slice(0, 4).map((skill) => <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>)}</div>
                    <div className="flex items-center justify-between pt-2">
                      {isApplied ? <Badge className="bg-primary/10 text-primary border-primary/20">Already applied</Badge> : <span className="text-xs text-muted-foreground">New opening</span>}
                      <Link to={`/jobs/${job.id}`}><Button className="rounded-xl">{isApplied ? "View Application" : "View & Apply"}</Button></Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <Card className="rounded-2xl border-border shadow-card mt-4"><CardContent className="py-12 text-center text-muted-foreground">No jobs found for your current search.</CardContent></Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
