import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackButton from "@/components/PageBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CalendarDays, MapPin, Building2 } from "lucide-react";

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string[];
  skills: string[];
  stipendMin: number | null;
  stipendMax: number | null;
  deadline: string | null;
  status: string;
}

interface ExistingApplication {
  id: string;
  applicationStatus: string;
  appliedAt: string;
}

interface MyProfile {
  resumeUrl: string;
}

interface MyApp {
  id: string;
  jobId: string;
  applicationStatus: string;
  appliedAt: string;
}

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [job, setJob] = useState<JobData | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [existingApplication, setExistingApplication] = useState<ExistingApplication | null>(null);
  const [profileResumeUrl, setProfileResumeUrl] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (!jobId || !user) return;
    void loadPage(jobId);
  }, [jobId, user?.id, authLoading, navigate]);

  const isJobOpen = useMemo(() => {
    if (!job) return false;
    if (job.status !== "published") return false;
    if (!job.deadline) return true;
    return new Date(job.deadline) >= new Date();
  }, [job]);

  const loadPage = async (id: string) => {
    setLoading(true);

    try {
      const [jobData, profileData, appData] = await Promise.all([
        api.get(`/api/jobs/${id}`),
        api.get("/api/profiles/me"),
        api.get("/api/applications/me"),
      ]);

      setJob(jobData.job as JobData);
      setProfileResumeUrl((profileData.profile as MyProfile)?.resumeUrl || "");

      const app = ((appData.applications || []) as MyApp[]).find((a) => a.jobId === id);
      if (app) {
        setExistingApplication({ id: app.id, applicationStatus: app.applicationStatus, appliedAt: app.appliedAt });
      } else {
        setExistingApplication(null);
      }
    } catch {
      toast.error("Job not found");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job || !jobId) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (isAdmin) {
      toast.error("Admin accounts cannot apply to jobs.");
      return;
    }
    if (!isJobOpen) {
      toast.error("This job is no longer accepting applications.");
      return;
    }
    if (existingApplication) {
      toast.error("You already applied for this role.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.post(`/api/jobs/${jobId}/apply`, {
        coverLetter: coverLetter.trim(),
        resumeUrl: profileResumeUrl || "",
      });

      const app = data.application;
      setExistingApplication({ id: app.id, applicationStatus: app.applicationStatus, appliedAt: app.appliedAt });
      toast.success("Application submitted successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <PageBackButton label="Back to Jobs" fallbackTo="/jobs" className="mb-5 -ml-3" />

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border shadow-card mb-6">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="font-display text-3xl">{job.title}</CardTitle>
                    <p className="text-muted-foreground mt-2 flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">{job.employmentType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || "Not specified"}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />{job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : "No deadline"}</span>
                </div>

                {(job.stipendMin !== null || job.stipendMax !== null) && <p className="text-sm text-foreground">Stipend: {job.stipendMin ?? "0"} - {job.stipendMax ?? "Open"}</p>}

                <div>
                  <h3 className="font-display text-lg font-semibold mb-2">About This Role</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{job.description}</p>
                </div>

                {job.requirements?.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc pl-5 text-muted-foreground space-y-1">{job.requirements.map((item, idx) => <li key={`${item}-${idx}`}>{item}</li>)}</ul>
                  </div>
                )}

                {job.skills?.length > 0 && (
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">{job.skills.map((skill) => <Badge key={skill} variant="outline">{skill}</Badge>)}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border shadow-card">
              <CardHeader><CardTitle className="font-display text-2xl">Apply for this role</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {existingApplication ? (
                  <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <p className="font-medium text-foreground">You have already applied.</p>
                    <p className="text-sm text-muted-foreground mt-1">Status: <span className="capitalize">{existingApplication.applicationStatus}</span> · Applied on {new Date(existingApplication.appliedAt).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Cover Letter (optional)</Label>
                      <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} rows={6} placeholder="Share why you're a good fit for this role..." />
                    </div>
                    {!profileResumeUrl && <p className="text-sm text-muted-foreground">You have not uploaded a resume yet. Add one in your profile to strengthen your application.</p>}
                    <Button onClick={handleApply} disabled={submitting || !isJobOpen || isAdmin} className="rounded-xl">{submitting ? "Submitting..." : "Submit Application"}</Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetails;
