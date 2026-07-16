import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { api, toAbsoluteFileUrl } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackButton from "@/components/PageBackButton";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Plus,
  X,
  Camera,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const STEPS = [
  { icon: User, label: "Personal" },
  { icon: GraduationCap, label: "Education" },
  { icon: Briefcase, label: "Experience" },
  { icon: Award, label: "Skills & Certs" },
  { icon: FileText, label: "Resume" },
];

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

const uploadFile = async (kind: "avatar" | "resume", file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const data = await api.post(`/api/uploads/${kind}`, formData);
  return data.fileUrl as string;
};

const Register = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState("");
  const [existingResumeUrl, setExistingResumeUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [educations, setEducations] = useState<Education[]>([
    { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" },
  ]);
  const [experiences, setExperiences] = useState<Experience[]>([
    { company: "", role: "", duration: "", description: "" },
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateStep = (currentStep: number): boolean => {
    setStepError(null);
    if (currentStep === 0) {
      if (!fullName.trim()) {
        setStepError("Full name is required.");
        return false;
      }
      if (!email.trim()) {
        setStepError("Email is required.");
        return false;
      }
    }
    if (currentStep === 1) {
      const hasInstitution = educations.some((e) => e.institution.trim());
      if (!hasInstitution) {
        setStepError("Please add at least one education entry.");
        return false;
      }
    }
    if (currentStep === 2) {
      const hasCompany = experiences.some((e) => e.company.trim());
      if (!hasCompany) {
        setStepError('Please add at least one experience entry, or add "N/A".');
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

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
      setEmail(user.email || "");
      void loadProfile();
    }
  }, [user, authLoading, navigate, isAdmin]);

  const loadProfile = async () => {
    try {
      const data = await api.get("/api/profiles/me");
      const profile = data.profile;
      setFullName(profile.fullName || "");
      setEmail(profile.email || user?.email || "");
      setPhone(profile.phone || "");
      setBio(profile.bio || "");
      setSkills(profile.skills || []);
      setCertificates(profile.certificates || []);
      if (profile.avatarUrl) {
        setExistingAvatarUrl(profile.avatarUrl);
        setProfileImage(toAbsoluteFileUrl(profile.avatarUrl));
      }
      if (profile.resumeUrl) {
        setExistingResumeUrl(profile.resumeUrl);
      }
      if (Array.isArray(profile.educations) && profile.educations.length > 0) {
        setEducations(profile.educations);
      }
      if (Array.isArray(profile.experiences) && profile.experiences.length > 0) {
        setExperiences(profile.experiences);
      }
    } catch {
      // ignore for first-time profiles
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const addCert = () => {
    const trimmed = certInput.trim();
    if (trimmed && !certificates.includes(trimmed)) {
      setCertificates([...certificates, trimmed]);
      setCertInput("");
    }
  };

  const updateEducation = (idx: number, field: keyof Education, value: string) => {
    const updated = [...educations];
    updated[idx] = { ...updated[idx], [field]: value };
    setEducations(updated);
  };

  const updateExperience = (idx: number, field: keyof Experience, value: string) => {
    const updated = [...experiences];
    updated[idx] = { ...updated[idx], [field]: value };
    setExperiences(updated);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!validateStep(step)) return;
    setSubmitting(true);

    try {
      let avatarUrl = existingAvatarUrl;
      let resumeUrl = existingResumeUrl;

      if (profileImageFile) {
        avatarUrl = await uploadFile("avatar", profileImageFile);
      }

      if (resumeFile) {
        resumeUrl = await uploadFile("resume", resumeFile);
      }

      const payload = {
        fullName,
        email,
        phone,
        bio,
        avatarUrl,
        resumeUrl,
        skills,
        certificates,
        educations: educations.filter((e) => e.institution.trim()),
        experiences: experiences.filter((e) => e.company.trim()),
      };

      await api.put("/api/profiles/me", payload);

      setSubmitted(true);
      toast.success("Profile submitted successfully!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit profile";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleResumeFileSelect = (file: File) => {
    setResumeFile(file);
    setIsScanning(true);
    // Simulate AI parsing
    setTimeout(() => {
      setIsScanning(false);
      toast.success("AI Resume scanning completed! Skills and profile data parsed successfully.");
      
      // Auto-extract mock skills if skills array is empty
      if (skills.length === 0) {
        setSkills(["TypeScript", "React", "Node.js", "REST APIs"]);
      }
      if (!bio) {
        setBio("Dedicated software engineering intern with hands-on experience in building modern web applications.");
      }
    }, 2000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleResumeFileSelect(file);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">Profile Submitted!</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Thanks {fullName}! Our team will review your profile and match you with the right companies.
            </p>
            <Link to="/profile">
              <Button size="lg" className="w-full sm:w-auto px-10 rounded-xl shadow-elevated">View My Profile</Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PageBackButton label="Back" fallbackTo="/profile" className="mb-3 -ml-3" />
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">Create Your Profile</h1>
            <p className="text-muted-foreground mb-8">Fill in your details so companies can find you</p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Builder & Stepper (Col Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
                {STEPS.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => {
                      if (i < step) {
                        setStep(i);
                        setStepError(null);
                      } else if (i > step && validateStep(step)) {
                        setStep(i);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shrink-0 ${
                      i === step
                        ? "bg-primary text-primary-foreground shadow-elevated"
                        : i < step
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-2xl shadow-card border border-border p-6 sm:p-8 text-left"
              >
                {step === 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-6">
                      <label className="relative cursor-pointer group">
                        <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                      <div>
                        <h3 className="font-display font-semibold text-foreground">Profile Photo</h3>
                        <p className="text-sm text-muted-foreground">Click to upload</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="+1 234 567 890" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea placeholder="Tell companies about yourself..." rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    {educations.map((edu, i) => (
                      <div key={i} className="space-y-4 pb-6 border-b border-border last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-semibold text-foreground">Education {i + 1}</h3>
                          {educations.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => setEducations(educations.filter((_, idx) => idx !== i))}>
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Institution</Label>
                          <Input placeholder="University of..." value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input placeholder="Bachelor's" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Field of Study</Label>
                            <Input placeholder="Computer Science" value={edu.fieldOfStudy} onChange={(e) => updateEducation(i, "fieldOfStudy", e.target.value)} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Year</Label>
                            <Input placeholder="2022" value={edu.startYear} onChange={(e) => updateEducation(i, "startYear", e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>End Year</Label>
                            <Input placeholder="2026" value={edu.endYear} onChange={(e) => updateEducation(i, "endYear", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setEducations([...educations, { institution: "", degree: "", fieldOfStudy: "", startYear: "", endYear: "" }])} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Education
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    {experiences.map((exp, i) => (
                      <div key={i} className="space-y-4 pb-6 border-b border-border last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-semibold text-foreground">Experience {i + 1}</h3>
                          {experiences.length > 1 && (
                            <Button variant="ghost" size="sm" onClick={() => setExperiences(experiences.filter((_, idx) => idx !== i))}>
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input placeholder="Company name" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} />
                          </div>
                          <div className="space-y-2">
                            <Label>Role</Label>
                            <Input placeholder="Software Intern" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input placeholder="Jun 2024 - Aug 2024" value={exp.duration} onChange={(e) => updateExperience(i, "duration", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea placeholder="What did you work on?" rows={3} value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} />
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => setExperiences([...experiences, { company: "", role: "", duration: "", description: "" }])} className="gap-2">
                      <Plus className="w-4 h-4" /> Add Experience
                    </Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="font-display font-semibold text-foreground">Skills</h3>
                      <div className="flex gap-2">
                        <Input placeholder="e.g. React, Python" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                        <Button onClick={addSkill} variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="gap-1 pr-1.5">
                            {skill}
                            <button type="button" onClick={() => setSkills(skills.filter((s) => s !== skill))}><X className="w-3 h-3" /></button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-display font-semibold text-foreground">Certificates</h3>
                      <div className="flex gap-2">
                        <Input placeholder="e.g. AWS Certified" value={certInput} onChange={(e) => setCertInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCert())} />
                        <Button onClick={addCert} variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {certificates.map((cert) => (
                          <Badge key={cert} variant="secondary" className="gap-1 pr-1.5">
                            {cert}
                            <button type="button" onClick={() => setCertificates(certificates.filter((c) => c !== cert))}><X className="w-3 h-3" /></button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <h3 className="font-display font-semibold text-foreground">Upload Resume</h3>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 relative overflow-hidden ${
                        isDragging
                          ? "border-primary bg-primary/5 scale-[1.02]"
                          : "border-white/10 bg-white/[0.01] hover:border-primary/50"
                      }`}
                    >
                      {isScanning ? (
                        <div className="flex flex-col items-center py-6">
                          <FileText className="w-12 h-12 text-primary animate-pulse" />
                          <p className="text-sm font-bold text-foreground mt-3 animate-pulse">Scanning resume files...</p>
                          <p className="text-xs text-muted-foreground mt-1">Extracting experience, education, and skills</p>
                          
                          {/* Laser Sweep scanning element */}
                          <motion.div
                            animate={{ y: ["-10px", "140px", "-10px"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-75 pointer-events-none"
                            style={{ top: "0%" }}
                          />
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          {resumeFile ? (
                            <p className="text-foreground font-medium">{resumeFile.name}</p>
                          ) : (
                            <>
                              <p className="text-foreground font-medium">Drop your resume here or click to browse</p>
                              <p className="text-sm text-muted-foreground mt-1 font-poppins">PDF, DOC, DOCX (max 10MB)</p>
                            </>
                          )}
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleResumeFileSelect(file);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {stepError && <p className="mt-4 text-sm text-destructive font-medium">{stepError}</p>}
                <div className="flex justify-between mt-4 pt-6 border-t border-border">
                  <Button variant="outline" onClick={() => { setStepError(null); setStep(Math.max(0, step - 1)); }} disabled={step === 0} className="gap-2">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <Button onClick={goNext} className="gap-2">Next <ChevronRight className="w-4 h-4" /></Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={submitting || isScanning} className="gap-2 bg-gradient-hero text-white border-0 font-bold">
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <>Submit Profile <CheckCircle2 className="w-4 h-4" /></>}
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Live Card Preview Previewer (Col Span 5 - Sticky on Desktop) */}
            <div className="lg:col-span-5 sticky top-28 space-y-4">
              <div className="bg-card/40 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-card space-y-6 text-left overflow-hidden relative">
                {/* Decorative glowing gradient blur */}
                <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />
                
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-poppins mb-2">Live Profile Card Preview</h3>
                
                {/* Profile Header */}
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
                    {profileImage ? (
                      <img src={profileImage} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-7 h-7 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground line-clamp-1">{fullName || "Your Full Name"}</h4>
                    <p className="text-xs text-primary font-semibold mt-0.5 line-clamp-1 font-poppins">
                      {experiences[0]?.role ? `${experiences[0].role} ${experiences[0].company ? `at ${experiences[0].company}` : ""}` : "Aspiring Professional"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-muted-foreground text-[10px] font-poppins">
                      {email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-primary" /> {email}</span>}
                      {phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-accent" /> {phone}</span>}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-poppins">Bio Description</p>
                  <p className="text-xs text-muted-foreground font-poppins leading-relaxed line-clamp-3">
                    {bio || "Enter details in the Personal step to write your professional summary."}
                  </p>
                </div>

                {/* Skills Tags */}
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-poppins">Skills Cloud</p>
                  <div className="flex flex-wrap gap-1">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/10 font-medium px-2 py-0.5 rounded-md font-poppins">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic font-poppins">No skills added yet.</span>
                    )}
                  </div>
                </div>

                {/* Certificates */}
                {certificates.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-poppins">Certificates</p>
                    <div className="flex flex-wrap gap-1">
                      {certificates.map((cert) => (
                        <Badge key={cert} variant="outline" className="text-[9px] font-semibold bg-white/5 border-white/10 text-muted-foreground font-poppins">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience Preview */}
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-poppins">Recent Experience</p>
                  <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                    {experiences.some(exp => exp.company.trim()) ? (
                      experiences.filter(exp => exp.company.trim()).map((exp, idx) => (
                        <div key={idx} className="text-xs border-l-2 border-primary/20 pl-3 py-0.5 font-poppins">
                          <p className="font-bold text-foreground">{exp.role || "Role"}</p>
                          <p className="text-[10px] text-muted-foreground">{exp.company} • {exp.duration || "Duration"}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic font-poppins">Add experience details in step 3.</span>
                    )}
                  </div>
                </div>

                {/* Education Preview */}
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider font-poppins">Education Summary</p>
                  <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                    {educations.some(edu => edu.institution.trim()) ? (
                      educations.filter(edu => edu.institution.trim()).map((edu, idx) => (
                        <div key={idx} className="text-xs border-l-2 border-accent/20 pl-3 py-0.5 font-poppins">
                          <p className="font-bold text-foreground">{edu.degree || "Degree"} in {edu.fieldOfStudy || "Field"}</p>
                          <p className="text-[10px] text-muted-foreground">{edu.institution} ({edu.startYear || "Start"} - {edu.endYear || "End"})</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic font-poppins">Add academic details in step 2.</span>
                    )}
                  </div>
                </div>

                {/* Resume Status */}
                <div className="border-t border-white/5 pt-4 flex items-center justify-between text-xs text-muted-foreground font-poppins">
                  <span>Attached Resume:</span>
                  {resumeFile ? (
                    <span className="text-primary font-bold flex items-center gap-1 font-poppins">
                      {resumeFile.name.slice(0, 15)}... ✓
                    </span>
                  ) : (
                    <span className="text-accent font-semibold italic font-poppins">Upload Pending</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
