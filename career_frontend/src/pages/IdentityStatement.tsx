import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  Sparkles,
  X,
  Plus,
  RefreshCw,
  ArrowRight,
  Loader2,
  GraduationCap,
  Wrench,
  Heart,
} from "lucide-react";

// --- TYPES ---
interface TopSkill {
  skill_name: string;
  score: number;
  reasoning: string;
}

interface UserDraft {
  archetype_title: string;
  psychological_profile: string;
  core_traits: string[];
  hidden_potential: string;
  work_environment: string;
}

export default function IdentityStatement() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isFusing, setIsFusing] = useState(false);

  // Left Panel - Editable Tags
  const [education, setEducation] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);

  // New tag input
  const [newEducation, setNewEducation] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  // Right Panel - Identity Statement
  const [identityStatement, setIdentityStatement] = useState("");

  // Data from previous steps
  const [verifiedSkills, setVerifiedSkills] = useState<TopSkill[]>([]);
  const [psychometricDraft, setPsychometricDraft] = useState<UserDraft | null>(
    null,
  );

  // Initialize on mount
  useEffect(() => {
    const initializeIdentity = async () => {
      try {
        // Get verified skills from SkillAssessment
        const storedSkills = localStorage.getItem("verifiedSkills");
        if (!storedSkills) {
          // Use defaults if not available
          setVerifiedSkills([
            {
              skill_name: "Problem Solving",
              score: 85,
              reasoning: "Based on your analytical traits",
            },
            {
              skill_name: "Communication",
              score: 78,
              reasoning: "Based on your empathy scores",
            },
            {
              skill_name: "Technical Writing",
              score: 72,
              reasoning: "Based on your systems thinking",
            },
          ]);
        } else {
          const parsedSkills = JSON.parse(storedSkills);
          setVerifiedSkills(parsedSkills);
          // Pre-populate skills from verified skills
          setSkills(parsedSkills.map((s: TopSkill) => s.skill_name));
        }

        // Get psychometric draft
        const storedDraft = localStorage.getItem("prismDraft");
        if (storedDraft) {
          const draft = JSON.parse(storedDraft);
          setPsychometricDraft(draft);
        }

        // Generate initial identity statement
        await generateIdentityStatement();
      } catch (error) {
        console.error("Init Error:", error);
        toast.error("Failed to initialize. Please retake assessments.");
      }
    };

    initializeIdentity();
  }, []);

  const generateIdentityStatement = async (regenerating = false) => {
    if (regenerating) {
      setIsRegenerating(true);
    } else {
      setIsGenerating(true);
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/identity/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "student_mvp_01",
            constraints: {
              education:
                education.length > 0 ? education : ["Computer Science"],
              skills:
                skills.length > 0
                  ? skills
                  : verifiedSkills.map((s) => s.skill_name),
              interests:
                interests.length > 0
                  ? interests
                  : ["Technology", "Problem Solving"],
            },
            psychometric_profile:
              psychometricDraft?.psychological_profile ||
              "Analytical and empathetic problem solver",
          }),
        },
      );

      if (!response.ok)
        throw new Error("Failed to generate identity statement");

      const data = await response.json();
      setIdentityStatement(data.identity_statement);
    } catch (error) {
      console.error("Generation Error:", error);
      // Fallback statement
      setIdentityStatement(
        "I am a dedicated professional with strong analytical abilities and a passion for solving complex problems. By applying my technical skills and interpersonal strengths, I aim to contribute meaningfully to innovative projects that make a difference.",
      );
    } finally {
      setIsGenerating(false);
      setIsRegenerating(false);
    }
  };

  // Tag management functions
  const addEducation = () => {
    if (newEducation.trim() && !education.includes(newEducation.trim())) {
      setEducation([...education, newEducation.trim()]);
      setNewEducation("");
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeEducation = (item: string) => {
    setEducation(education.filter((e) => e !== item));
  };

  const removeSkill = (item: string) => {
    setSkills(skills.filter((s) => s !== item));
  };

  const removeInterest = (item: string) => {
    setInterests(interests.filter((i) => i !== item));
  };

  const handleRegenerate = () => {
    generateIdentityStatement(true);
  };

  const handleExplorePaths = async () => {
    setIsFusing(true);

    try {
      // Get all data for graph fusion
      const storedDraft = localStorage.getItem("prismDraft");
      if (!storedDraft) throw new Error("No psychometric profile found");

      const psychometric_draft = JSON.parse(storedDraft);

      // Prepare skills as verified skills format
      const verified_skills_data = {
        // Convert skills array to numeric scores (simplified)
        math_aptitude: 70,
        math_affinity: 70,
        english_communication: 75,
        science_logic: 80,
        digital_creation: skills.length > 0 ? 80 : 0,
        system_troubleshooting: skills.some((s) =>
          s.toLowerCase().includes("troubleshoot"),
        )
          ? 80
          : 0,
        community_management: interests.some((i) =>
          i.toLowerCase().includes("community"),
        )
          ? 80
          : 0,
        commercial_hustle: interests.some((i) =>
          i.toLowerCase().includes("business"),
        )
          ? 80
          : 0,
      };

      // Call graph fusion endpoint
      const response = await fetch("http://127.0.0.1:8000/api/v1/roles/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "student_mvp_01",
          psychometric_draft: psychometric_draft,
          verified_skills: verified_skills_data,
        }),
      });

      if (!response.ok) throw new Error("Graph Fusion failed");

      const data = await response.json();

      // Save the final matches and navigate to dashboard
      localStorage.setItem("finalMatches", JSON.stringify(data.matches));
      localStorage.setItem("identityStatement", identityStatement);

      toast.success("Graph Fusion Complete!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Fusion Error:", error);
      toast.error("Failed to connect to the Graph Engine.");
      setIsFusing(false);
    }
  };

  // Loading state
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <BrainCircuit className="w-20 h-20 text-blue-500 animate-pulse mx-auto" />
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Crafting Your Identity...
          </h2>
          <p className="text-slate-500 font-medium">
            Our AI is weaving your traits, skills, and aspirations into a
            compelling career narrative.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight mb-2">
            Your Career Identity
          </h1>
          <p className="text-slate-500">
            Review and customize your profile. Click "Re-generate" to update the
            statement.
          </p>
        </div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL: Constraint Controllers (Inputs) */}
          <div className="space-y-6">
            {/* Education Section */}
            <Card className="p-6 bg-white border-0 shadow-lg rounded-[1.5rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Education</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {education.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {item}
                    <button
                      onClick={() => removeEducation(item)}
                      className="hover:text-purple-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEducation}
                  onChange={(e) => setNewEducation(e.target.value)}
                  placeholder="Add education (e.g., B.Tech in CSE)"
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyPress={(e) => e.key === "Enter" && addEducation()}
                />
                <button
                  onClick={addEducation}
                  className="p-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </Card>

            {/* Skills Section */}
            <Card className="p-6 bg-white border-0 shadow-lg rounded-[1.5rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-xl">
                  <Wrench className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Skills</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                  >
                    {item}
                    <button
                      onClick={() => removeSkill(item)}
                      className="hover:text-green-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill (e.g., Python, Data Analysis)"
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="p-2 bg-green-100 text-green-600 rounded-xl hover:bg-green-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </Card>

            {/* Interests Section */}
            <Card className="p-6 bg-white border-0 shadow-lg rounded-[1.5rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 rounded-xl">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Interests</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {interests.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {item}
                    <button
                      onClick={() => removeInterest(item)}
                      className="hover:text-pink-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add interest (e.g., AI, Marketing)"
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                  onKeyPress={(e) => e.key === "Enter" && addInterest()}
                />
                <button
                  onClick={addInterest}
                  className="p-2 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </Card>
          </div>

          {/* RIGHT PANEL: Identity Statement (Output) */}
          <div className="space-y-6">
            <Card className="p-8 bg-white border-0 shadow-xl rounded-[2rem] h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                  Career Identity Statement
                </h3>
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  {isRegenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Re-generate
                </button>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
                  {identityStatement}
                </p>
              </div>

              {/* Verified Skills Display */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Your Verified Skills
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {verifiedSkills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {skill.skill_name}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {skill.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="flex-1 py-6 rounded-xl border-2 border-slate-200 hover:bg-slate-50"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Re-generate Statement
                </Button>
                <Button
                  onClick={handleExplorePaths}
                  disabled={isFusing}
                  className="flex-1 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium"
                >
                  {isFusing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Fusing Graph...
                    </>
                  ) : (
                    <>
                      Explore Career Paths
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
