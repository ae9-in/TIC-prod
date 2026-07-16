import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackButton from "@/components/PageBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader2, MapPin, CalendarDays, Building2, LayoutGrid, List, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  description: string;
  skills: string[];
  deadline: string | null;
  stipendMin?: number | null;
  stipendMax?: number | null;
  status: string;
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Detailed sheet drawer state
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [profileResumeUrl, setProfileResumeUrl] = useState("");
  const [userSkills, setUserSkills] = useState<string[]>([]);

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
      const [jobsData, appsData, profileData] = await Promise.all([
        api.get("/api/jobs"),
        api.get("/api/applications/me"),
        api.get("/api/profiles/me").catch(() => null),
      ]);
      setJobs((jobsData.jobs || []) as JobItem[]);
      setAppliedJobIds(new Set(((appsData.applications || []) as MyApp[]).map((a) => a.jobId)));

      if (profileData && profileData.profile) {
        setProfileResumeUrl(profileData.profile.resumeUrl || "");
        setUserSkills(profileData.profile.skills || []);
      }
    } catch (err) {
      toast.error("Failed to load listings");
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

  const handleOpenDrawer = (job: JobItem) => {
    setSelectedJob(job);
    setCoverLetter("");
    setDrawerOpen(true);
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    if (isAdmin) {
      toast.error("Admins cannot apply to roles.");
      return;
    }
    if (!profileResumeUrl) {
      toast.error("Please upload a resume in settings first!");
      return;
    }

    setApplying(true);
    try {
      await api.post(`/api/jobs/${selectedJob.id}/apply`, {
        coverLetter: coverLetter.trim(),
        resumeUrl: profileResumeUrl,
      });
      setAppliedJobIds((prev) => {
        const next = new Set(prev);
        next.add(selectedJob.id);
        return next;
      });
      toast.success("Successfully applied!");
      setDrawerOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  // Skill matching calculation
  const skillMatchInfo = useMemo(() => {
    if (!selectedJob) return { percentage: 0, matched: [] as string[] };
    const jobSkills = selectedJob.skills || [];
    if (jobSkills.length === 0) return { percentage: 100, matched: [] as string[] };
    const matched = jobSkills.filter((s) =>
      userSkills.map((us) => us.toLowerCase()).includes(s.toLowerCase())
    );
    const percentage = Math.round((matched.length / jobSkills.length) * 100);
    return { percentage, matched };
  }, [selectedJob, userSkills]);

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
          {/* Header section with view switches */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <PageBackButton label="Back" fallbackTo={isAdmin ? "/admin" : "/profile"} className="mb-3 -ml-3" />
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">Open Roles</h1>
              <p className="text-muted-foreground">Explore opportunities and apply in a few clicks.</p>
            </motion.div>

            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1 self-start">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-2 h-9 w-9 ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-2 h-9 w-9 ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground"}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-8">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, company, location, or skill..."
              className="h-12 rounded-xl border-white/10 bg-white/[0.02] focus-visible:ring-primary focus-visible:ring-offset-0 focus:border-primary/50 text-base"
            />
          </div>

          {/* Jobs Listing grid/list dynamically animated */}
          <motion.div
            layout
            className={viewMode === "grid" ? "grid md:grid-cols-2 gap-6" : "space-y-4"}
          >
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => {
                const isApplied = appliedJobIds.has(job.id);
                return (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`rounded-2xl border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-primary/20 backdrop-blur-md shadow-card transition-all duration-300 ${
                        viewMode === "list" ? "flex flex-col md:flex-row items-start md:items-center justify-between p-2" : ""
                      }`}
                    >
                      <div className="flex-1 w-full">
                        <CardHeader className={viewMode === "list" ? "pb-2 pt-4" : ""}>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="font-display text-xl group-hover:text-primary transition-colors">
                                {job.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 font-poppins">
                                <Building2 className="w-4 h-4 text-primary" /> {job.company}
                              </p>
                            </div>
                            <Badge variant="secondary" className="capitalize text-xs font-semibold">
                              {job.employmentType}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className={`space-y-4 ${viewMode === "list" ? "pb-4 pt-1" : ""}`}>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-poppins">
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" /> {job.location || "Not specified"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="w-4 h-4" />
                              {job.deadline ? `Apply by ${new Date(job.deadline).toLocaleDateString()}` : "Open until filled"}
                            </span>
                          </div>
                          
                          {viewMode === "grid" && (
                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-poppins">
                              {job.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-1.5">
                            {(job.skills || []).slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-[10px] font-semibold font-poppins bg-white/5 border-white/10 text-muted-foreground">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            {isApplied ? (
                              <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-3 py-1 font-poppins">
                                Already applied
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground font-poppins">New opening</span>
                            )}
                            <Button
                              onClick={() => handleOpenDrawer(job)}
                              className="rounded-xl px-5 hover:scale-[1.02] active:scale-[0.98] transition-all bg-gradient-hero text-white border-0 font-bold"
                            >
                              {isApplied ? "View Status" : "View & Apply"}
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filteredJobs.length === 0 && (
            <Card className="rounded-2xl border-white/5 bg-white/[0.01] shadow-card mt-4">
              <CardContent className="py-12 text-center text-muted-foreground font-poppins">
                No jobs found for your current search.
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />

      {/* Slide-out Sheet Drawer details preview and apply */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-xl bg-background/95 border-l border-white/10 backdrop-blur-xl p-8 overflow-y-auto">
          {selectedJob && (
            <div className="space-y-6 pt-4">
              <SheetHeader className="text-left">
                <div className="flex items-center justify-between gap-4">
                  <Badge variant="secondary" className="capitalize text-xs font-bold font-poppins">
                    {selectedJob.employmentType}
                  </Badge>
                  {appliedJobIds.has(selectedJob.id) && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 font-bold font-poppins">
                      Already Applied
                    </Badge>
                  )}
                </div>
                <SheetTitle className="font-display text-2xl lg:text-3xl text-foreground mt-3">
                  {selectedJob.title}
                </SheetTitle>
                <p className="text-sm font-semibold text-primary flex items-center gap-1.5 mt-1 font-poppins">
                  <Building2 className="w-4 h-4" /> {selectedJob.company}
                </p>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 my-2 text-sm text-muted-foreground font-poppins">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Location</p>
                  <p className="text-foreground font-medium flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" /> {selectedJob.location || "Remote"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Deadline</p>
                  <p className="text-foreground font-medium flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4 text-accent" />
                    {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : "Open until filled"}
                  </p>
                </div>
                {(selectedJob.stipendMin !== undefined || selectedJob.stipendMax !== undefined) && (
                  <div className="col-span-2 pt-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Stipend Range</p>
                    <p className="text-foreground font-semibold">
                      ₹{selectedJob.stipendMin ?? 0} - ₹{selectedJob.stipendMax ?? "Open"} / month
                    </p>
                  </div>
                )}
              </div>

              {/* Skills Match Indicator (Wow factor!) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground font-poppins flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Profile Match Score
                  </span>
                  <span className="text-xs font-extrabold text-primary font-poppins">
                    {skillMatchInfo.percentage}% Match
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skillMatchInfo.percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-hero"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(selectedJob.skills || []).map((skill) => {
                    const isMatched = skillMatchInfo.matched.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                    return (
                      <Badge
                        key={skill}
                        variant={isMatched ? "default" : "outline"}
                        className={`text-[10px] font-semibold ${
                          isMatched
                            ? "bg-primary/20 text-primary border-primary/30"
                            : "bg-white/5 border-white/10 text-muted-foreground"
                        }`}
                      >
                        {skill} {isMatched && "✓"}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Job Description</p>
                <p className="text-muted-foreground text-sm font-poppins leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              {/* Interactive Form for Easy Apply */}
              <div className="border-t border-white/5 pt-6 mt-4 space-y-4">
                {!appliedJobIds.has(selectedJob.id) ? (
                  <>
                    {profileResumeUrl ? (
                      <div className="space-y-4 text-left">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-foreground font-poppins">Cover Letter (Optional)</label>
                          <Textarea
                            placeholder="Briefly state why you're a great fit..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={3}
                            className="bg-white/[0.01] border-white/10 text-sm"
                          />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs text-muted-foreground font-poppins">
                          <span>Target Resume:</span>
                          <span className="text-primary font-bold">profile_resume.pdf ✓</span>
                        </div>
                        <Button
                          onClick={handleApply}
                          disabled={applying}
                          className="w-full rounded-xl py-6 bg-gradient-hero text-white text-sm font-bold shadow-elevated hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border-0"
                        >
                          {applying ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>Submit Application <ChevronRight className="w-4 h-4" /></>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-center space-y-3">
                        <p className="text-xs text-muted-foreground font-poppins leading-relaxed">
                          You haven't uploaded a resume to your profile yet. Please upload it first to apply.
                        </p>
                        <Link to="/register" onClick={() => setDrawerOpen(false)}>
                          <Button size="sm" variant="outline" className="rounded-lg text-xs font-semibold">
                            Complete Profile Now
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center space-y-2 font-poppins">
                    <CheckCircle2 className="w-8 h-8 text-primary animate-bounce" />
                    <p className="text-sm font-bold text-foreground">Already Applied</p>
                    <p className="text-xs text-muted-foreground">
                      Your application has been received and is currently under review by {selectedJob.company}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Jobs;
