import { useState, useEffect } from "react";
import { useNavigate, Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, toAbsoluteFileUrl } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageBackButton from "@/components/PageBackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  Edit,
  Loader2,
  Calendar,
  ShieldCheck,
} from "lucide-react";

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

interface ProfileData {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  certificates: string[];
  resumeUrl?: string;
  educations: Education[];
  experiences: Experience[];
  role?: "candidate" | "admin";
}

const Profile = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const { profileId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const viewingCandidateProfile = Boolean(profileId && isAdmin);
  const viewingAdminSelf = Boolean(isAdmin && !profileId);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (!authLoading && profileId && !isAdmin) {
      navigate("/profile");
      return;
    }

    if (user) {
      void loadProfileData();
    }
  }, [user, authLoading, navigate, profileId, isAdmin]);

  const loadProfileData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const data = viewingCandidateProfile && profileId
        ? await api.get(`/api/profiles/${profileId}`)
        : await api.get("/api/profiles/me");

      setProfile(data.profile);
    } catch (error) {
      if (viewingAdminSelf) {
        setProfile({
          id: "admin-self",
          userId: user.id,
          fullName: "Platform Admin",
          email: user.email,
          phone: "",
          bio: "",
          avatarUrl: "",
          skills: [],
          certificates: [],
          educations: [],
          experiences: [],
          role: "admin",
        });
      } else {
        console.error("Error loading profile:", error);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Current and new password are required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setChangingPassword(true);
    try {
      const data = await api.post("/api/auth/change-password", { currentPassword, newPassword });
      toast.success((data.message as string) || "Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not change password");
    } finally {
      setChangingPassword(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">No profile found</h2>
        <p className="text-muted-foreground mb-6">
          {viewingCandidateProfile ? "Candidate profile is unavailable." : "You haven't created your profile yet."}
        </p>
        {viewingCandidateProfile ? (
          <PageBackButton label="Back to Admin" fallbackTo="/admin" />
        ) : (
          <Link to="/register">
            <Button>Create Profile Now</Button>
          </Link>
        )}
      </div>
    );
  }

  const avatarSrc = profile.avatarUrl ? toAbsoluteFileUrl(profile.avatarUrl) : "";
  const resumeHref = profile.resumeUrl ? toAbsoluteFileUrl(profile.resumeUrl) : "";
  const adminBackTab = searchParams.get("tab") || "applications";
  const adminBackJobId = searchParams.get("jobId");
  const adminBackTo = adminBackJobId
    ? `/admin?tab=${encodeURIComponent(adminBackTab)}&jobId=${encodeURIComponent(adminBackJobId)}`
    : `/admin?tab=${encodeURIComponent(adminBackTab)}`;

  if (viewingAdminSelf) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-3xl space-y-5">
            <PageBackButton label="Back to Admin" fallbackTo="/admin" className="-ml-3" />
            <Card className="rounded-2xl border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-display flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Admin Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={profile.fullName || "Platform Admin"} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.email || user?.email || ""} readOnly />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <Button onClick={handleChangePassword} disabled={changingPassword}>
                  {changingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {viewingCandidateProfile && (
            <PageBackButton label="Back to Admin" fallbackTo={adminBackTo} className="mb-3 -ml-3" />
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl border border-border overflow-hidden shadow-card mb-8"
          >
            <div className="h-32 bg-gradient-hero w-full" />
            <div className="px-6 pb-8 sm:px-10 flex flex-col sm:flex-row items-end sm:items-center gap-6 -mt-12">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-muted border-4 border-card overflow-hidden shadow-elevated">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={profile.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 pt-12 sm:pt-0">
                <h1 className="text-3xl font-display font-bold text-foreground mb-1">{profile.fullName}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" /> {profile.email}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" /> {profile.phone}
                  </div>
                </div>
              </div>
              {!viewingCandidateProfile && (
                <Link to="/register">
                  <Button className="gap-2 rounded-xl">
                    <Edit className="w-4 h-4" /> Edit Profile
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-8">
              <Card className="rounded-2xl border-border shadow-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-display flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl font-display flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" /> Skills & Certs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.length > 0 ? (
                        profile.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="px-3 py-1 bg-primary/5 hover:bg-primary/10 border-primary/10 transition-colors">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No skills added</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.certificates.length > 0 ? (
                        profile.certificates.map((cert) => (
                          <Badge key={cert} variant="outline" className="px-3 py-1 border-primary/20 text-primary hover:bg-primary/5 transition-colors">
                            {cert}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No certifications added</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {profile.resumeUrl && (
                <Card className="rounded-2xl border-border shadow-card overflow-hidden bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Resume</h4>
                          <p className="text-xs text-muted-foreground">Professional CV</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-2" asChild>
                        <a href={resumeHref} target="_blank" rel="noreferrer">
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card className="rounded-2xl border-border shadow-card overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" /> Professional Experience
                  </CardTitle>
                  {!viewingCandidateProfile && (
                    <Link to="/register">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  )}
                </CardHeader>
                <CardContent className="space-y-8">
                  {profile.experiences.length > 0 ? (
                    profile.experiences.map((exp, i) => (
                      <div key={i} className="relative pl-6 border-l-2 border-primary/10 last:pb-0 pb-8">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-background" />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-bold text-lg text-foreground">{exp.role}</h3>
                          <span className="text-xs font-semibold px-2.5 py-1 bg-muted rounded-full text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {exp.duration}
                          </span>
                        </div>
                        <p className="text-primary font-medium text-sm mb-3">{exp.company}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground italic mb-4">No experience details added yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-card overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" /> Education
                  </CardTitle>
                  {!viewingCandidateProfile && (
                    <Link to="/register">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  )}
                </CardHeader>
                <CardContent className="space-y-8">
                  {profile.educations.length > 0 ? (
                    profile.educations.map((edu, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                            <h3 className="font-bold text-foreground">{edu.institution}</h3>
                            <span className="text-xs text-muted-foreground font-medium">{edu.startYear} - {edu.endYear}</span>
                          </div>
                          <p className="text-sm font-medium text-primary mb-1">{edu.degree}</p>
                          <p className="text-xs text-muted-foreground">{edu.fieldOfStudy}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground italic mb-4">No education details added yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
