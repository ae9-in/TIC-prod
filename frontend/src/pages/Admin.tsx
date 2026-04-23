import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api, toAbsoluteFileUrl } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import {
  FileText,
  ExternalLink,
  Mail,
  Loader2,
  Search,
  BriefcaseBusiness,
  Plus,
} from "lucide-react";

interface Candidate {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  resumeUrl: string;
  skills: string[];
}

interface JobRecord {
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
  createdAt: string;
}

interface JobApplication {
  id: string;
  applicationStatus: string;
  appliedAt: string;
  resumeUrl: string;
  candidate: {
    profileId: string;
    fullName: string;
    email: string;
  } | null;
  job: {
    id: string;
    title: string;
    company: string;
  } | null;
}

type Tab = "jobs" | "applications" | "candidates";

const initialJobForm = {
  title: "",
  company: "",
  location: "",
  employmentType: "internship",
  description: "",
  requirementsText: "",
  skillsText: "",
  stipendMin: "",
  stipendMax: "",
  deadline: "",
  status: "draft",
};

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("jobs");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const [candidateSearch, setCandidateSearch] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");

  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [savingJob, setSavingJob] = useState(false);
  const [jobForm, setJobForm] = useState(initialJobForm);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/profile");
      } else {
        void loadDashboard();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [profilesData, jobsData, appsData] = await Promise.all([
        api.get("/api/profiles"),
        api.get("/api/jobs"),
        api.get("/api/applications"),
      ]);

      setCandidates((profilesData.profiles || []) as Candidate[]);
      setJobs((jobsData.jobs || []) as JobRecord[]);
      setApplications((appsData.applications || []) as JobApplication[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  const openResume = (path: string) => {
    if (!path) {
      toast.error("Resume not available");
      return;
    }
    window.open(toAbsoluteFileUrl(path), "_blank", "noopener,noreferrer");
  };

  const handleJobFormChange = (field: keyof typeof initialJobForm, value: string) => {
    setJobForm((prev) => ({ ...prev, [field]: value }));
  };

  const parseList = (value: string) =>
    value
      .split(/[\n,]/)
      .map((v) => v.trim())
      .filter(Boolean);

  const resetJobForm = () => {
    setEditingJobId(null);
    setJobForm(initialJobForm);
  };

  const handleSaveJob = async () => {
    if (!jobForm.title.trim() || !jobForm.company.trim() || !jobForm.description.trim()) {
      toast.error("Title, company, and description are required.");
      return;
    }

    setSavingJob(true);

    const payload = {
      title: jobForm.title.trim(),
      company: jobForm.company.trim(),
      location: jobForm.location.trim(),
      employmentType: jobForm.employmentType,
      description: jobForm.description.trim(),
      requirements: parseList(jobForm.requirementsText),
      skills: parseList(jobForm.skillsText),
      stipendMin: jobForm.stipendMin ? Number(jobForm.stipendMin) : null,
      stipendMax: jobForm.stipendMax ? Number(jobForm.stipendMax) : null,
      deadline: jobForm.deadline ? new Date(jobForm.deadline).toISOString() : null,
      status: jobForm.status,
    };

    try {
      if (editingJobId) {
        await api.put(`/api/jobs/${editingJobId}`, payload);
        toast.success("Job updated successfully.");
      } else {
        await api.post("/api/jobs", payload);
        toast.success("Job created successfully.");
      }

      resetJobForm();
      await loadDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save job");
    } finally {
      setSavingJob(false);
    }
  };

  const startEditJob = (job: JobRecord) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      company: job.company,
      location: job.location,
      employmentType: job.employmentType,
      description: job.description,
      requirementsText: (job.requirements || []).join(", "),
      skillsText: (job.skills || []).join(", "),
      stipendMin: job.stipendMin?.toString() || "",
      stipendMax: job.stipendMax?.toString() || "",
      deadline: job.deadline ? new Date(job.deadline).toISOString().slice(0, 16) : "",
      status: job.status,
    });
    setActiveTab("jobs");
  };

  const updateJobStatus = async (jobId: string, status: "published" | "closed" | "draft") => {
    try {
      const existing = jobs.find((j) => j.id === jobId);
      if (!existing) return;
      await api.put(`/api/jobs/${jobId}`, {
        title: existing.title,
        company: existing.company,
        location: existing.location,
        employmentType: existing.employmentType,
        description: existing.description,
        requirements: existing.requirements,
        skills: existing.skills,
        stipendMin: existing.stipendMin,
        stipendMax: existing.stipendMax,
        deadline: existing.deadline,
        status,
      });
      toast.success(`Job marked as ${status}.`);
      await loadDashboard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await api.patch(`/api/applications/${applicationId}/status`, { applicationStatus: status });
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, applicationStatus: status } : app)));
      toast.success("Application status updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update application status");
    }
  };

  const filteredCandidates = useMemo(() => {
    const q = candidateSearch.trim().toLowerCase();
    if (!q) return candidates;
    return candidates.filter(
      (candidate) =>
        candidate.fullName.toLowerCase().includes(q) ||
        candidate.email.toLowerCase().includes(q) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(q)),
    );
  }, [candidates, candidateSearch]);

  const filteredApplications = useMemo(() => {
    const q = applicationSearch.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter(
      (app) =>
        (app.candidate?.fullName || "").toLowerCase().includes(q) ||
        (app.candidate?.email || "").toLowerCase().includes(q) ||
        (app.job?.title || "").toLowerCase().includes(q) ||
        (app.job?.company || "").toLowerCase().includes(q),
    );
  }, [applications, applicationSearch]);

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
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
              <BriefcaseBusiness className="w-8 h-8 text-primary" /> Admin Dashboard
            </h1>
            <p className="text-muted-foreground italic">Manage jobs, applications, and registered candidates.</p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant={activeTab === "jobs" ? "default" : "outline"} onClick={() => setActiveTab("jobs")} className="rounded-xl">
              Jobs ({jobs.length})
            </Button>
            <Button variant={activeTab === "applications" ? "default" : "outline"} onClick={() => setActiveTab("applications")} className="rounded-xl">
              Applications ({applications.length})
            </Button>
            <Button variant={activeTab === "candidates" ? "default" : "outline"} onClick={() => setActiveTab("candidates")} className="rounded-xl">
              Candidates ({candidates.length})
            </Button>
          </div>

          {activeTab === "jobs" && (
            <div className="grid lg:grid-cols-5 gap-6">
              <Card className="rounded-2xl border-border shadow-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" /> {editingJobId ? "Edit Job" : "Post New Job"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Job Title</Label><Input value={jobForm.title} onChange={(e) => handleJobFormChange("title", e.target.value)} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>Company</Label><Input value={jobForm.company} onChange={(e) => handleJobFormChange("company", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Location</Label><Input value={jobForm.location} onChange={(e) => handleJobFormChange("location", e.target.value)} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Employment Type</Label>
                      <select value={jobForm.employmentType} onChange={(e) => handleJobFormChange("employmentType", e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option value="internship">Internship</option><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select value={jobForm.status} onChange={(e) => handleJobFormChange("status", e.target.value)} className="w-full h-10 px-3 rounded-md border border-input bg-background">
                        <option value="draft">Draft</option><option value="published">Published</option><option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2"><Label>Description</Label><Textarea value={jobForm.description} onChange={(e) => handleJobFormChange("description", e.target.value)} rows={5} /></div>
                  <div className="space-y-2"><Label>Requirements (comma or new line separated)</Label><Textarea value={jobForm.requirementsText} onChange={(e) => handleJobFormChange("requirementsText", e.target.value)} rows={3} /></div>
                  <div className="space-y-2"><Label>Skills (comma or new line separated)</Label><Input value={jobForm.skillsText} onChange={(e) => handleJobFormChange("skillsText", e.target.value)} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2"><Label>Stipend Min</Label><Input type="number" value={jobForm.stipendMin} onChange={(e) => handleJobFormChange("stipendMin", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Stipend Max</Label><Input type="number" value={jobForm.stipendMax} onChange={(e) => handleJobFormChange("stipendMax", e.target.value)} /></div>
                  </div>
                  <div className="space-y-2"><Label>Deadline</Label><Input type="datetime-local" value={jobForm.deadline} onChange={(e) => handleJobFormChange("deadline", e.target.value)} /></div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveJob} disabled={savingJob} className="rounded-xl">{savingJob ? "Saving..." : editingJobId ? "Update Job" : "Create Job"}</Button>
                    {editingJobId && <Button variant="outline" onClick={resetJobForm} className="rounded-xl">Cancel</Button>}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-card lg:col-span-3 overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-border"><CardTitle className="font-display">Posted Jobs</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <div className="relative overflow-x-auto">
                    <Table>
                      <TableHeader><TableRow><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Deadline</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {jobs.map((job) => (
                          <TableRow key={job.id}>
                            <TableCell><div className="font-semibold text-foreground">{job.title}</div><div className="text-xs text-muted-foreground">{job.company}</div></TableCell>
                            <TableCell><Badge variant="outline" className="capitalize">{job.status}</Badge></TableCell>
                            <TableCell className="text-sm text-muted-foreground">{job.deadline ? new Date(job.deadline).toLocaleDateString() : "No deadline"}</TableCell>
                            <TableCell className="text-right">
                              <div className="inline-flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => startEditJob(job)}>Edit</Button>
                                {job.status !== "published" && <Button size="sm" onClick={() => updateJobStatus(job.id, "published")}>Publish</Button>}
                                {job.status !== "closed" && <Button variant="outline" size="sm" onClick={() => updateJobStatus(job.id, "closed")}>Close</Button>}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {jobs.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No jobs posted yet.</TableCell></TableRow>}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "applications" && (
            <Card className="rounded-2xl border-border shadow-card overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border space-y-3">
                <CardTitle className="font-display">Applications</CardTitle>
                <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input value={applicationSearch} onChange={(e) => setApplicationSearch(e.target.value)} placeholder="Search by candidate, email, job, company" className="pl-10" /></div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Candidate</TableHead><TableHead>Role</TableHead><TableHead>Applied</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell><div className="font-semibold text-foreground">{app.candidate?.fullName || "Candidate"}</div><div className="text-xs text-muted-foreground">{app.candidate?.email || "-"}</div></TableCell>
                          <TableCell><div className="font-medium text-foreground">{app.job?.title || "Job"}</div><div className="text-xs text-muted-foreground">{app.job?.company || "Company"}</div></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <select value={app.applicationStatus} onChange={(e) => updateApplicationStatus(app.id, e.target.value)} className="h-9 px-2 rounded-md border border-input bg-background text-sm capitalize">
                              <option value="submitted">Submitted</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rejected</option><option value="accepted">Accepted</option>
                            </select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex gap-2">
                              <Button size="icon" variant="ghost" onClick={() => openResume(app.resumeUrl)} title="View Resume"><FileText className="w-4 h-4 text-primary" /></Button>
                              {app.candidate?.profileId && <Button size="icon" variant="ghost" asChild title="View Profile"><Link to={`/profile/${app.candidate.profileId}`}><ExternalLink className="w-4 h-4" /></Link></Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredApplications.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No applications found.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "candidates" && (
            <Card className="rounded-2xl border-border shadow-card overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border space-y-3">
                <CardTitle className="font-display">Talent Pipeline</CardTitle>
                <div className="relative w-full md:w-96"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search by name, email, or skill" className="pl-10" value={candidateSearch} onChange={(e) => setCandidateSearch(e.target.value)} /></div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead className="w-[200px]">Candidate</TableHead><TableHead>Contact Info</TableHead><TableHead>Top Skills</TableHead><TableHead>Registered</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id} className="hover:bg-muted/20 transition-colors group">
                          <TableCell className="font-semibold text-foreground">{candidate.fullName}</TableCell>
                          <TableCell><div className="flex flex-col gap-0.5"><span className="text-sm flex items-center gap-1.5"><Mail className="w-3 h-3" /> {candidate.email}</span><span className="text-xs text-muted-foreground">{candidate.phone}</span></div></TableCell>
                          <TableCell><div className="flex flex-wrap gap-1">{(candidate.skills || []).slice(0, 3).map((skill, i) => <Badge key={i} variant="secondary" className="px-2 py-0 text-[10px] bg-primary/5 text-primary border-primary/10">{skill}</Badge>)}{(candidate.skills || []).length > 3 && <Badge variant="outline" className="px-2 py-0 text-[10px]">+{candidate.skills.length - 3}</Badge>}</div></TableCell>
                          <TableCell className="text-sm text-muted-foreground">{new Date(candidate.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" title="View Resume" onClick={() => openResume(candidate.resumeUrl)}><FileText className="w-4 h-4 text-primary" /></Button>
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" asChild title="View Full Profile"><Link to={`/profile/${candidate.id}`}><ExternalLink className="w-4 h-4" /></Link></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredCandidates.length === 0 && <TableRow><TableCell colSpan={5} className="h-40 text-center text-muted-foreground italic">No candidates match your search.</TableCell></TableRow>}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
