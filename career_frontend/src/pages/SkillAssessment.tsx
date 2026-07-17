import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Activity,
} from "lucide-react";

// --- STRICT SCHEMAS ---
interface AssessmentOption {
  option_id: string;
  text: string;
  is_correct: boolean;
}

interface AssessmentQuestion {
  id: string;
  skill_category: string;
  question_context: string;
  options: AssessmentOption[];
  explanation: string;
}

interface SkillAssessmentResponse {
  targeted_skills_tested: string[];
  dynamic_assessment: AssessmentQuestion[];
}

interface TopSkill {
  skill_name: string;
  score: number;
  reasoning: string;
}

interface SkillEvaluationResponse {
  top_5_skills: TopSkill[];
  assessment_summary: string;
}

export default function SkillAssessment() {
  const router = useRouter();
  const [gameState, setGameState] = useState<
    "loading" | "playing" | "evaluating" | "complete" | "error"
  >("loading");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userAnswers, setUserAnswers] = useState<
    { question_id: string; selected_option_id: string }[]
  >([]);
  const [assessmentData, setAssessmentData] =
    useState<SkillAssessmentResponse | null>(null);
  const [evaluatedSkills, setEvaluatedSkills] =
    useState<SkillEvaluationResponse | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Dynamic user ID
  const getUserId = useCallback(() => {
    let userId = localStorage.getItem("user_id");
    if (!userId) {
      userId = "student_mvp_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("user_id", userId);
    }
    return userId;
  }, []);

  // Initialize - fetch assessment questions from backend + resume
  useEffect(() => {
    // Resume from localStorage
    const savedState = localStorage.getItem("skillAssessmentState");
    if (savedState) {
      const {
        gameState: savedGameState,
        currentIndex: savedIndex,
        userAnswers: savedAnswers,
      } = JSON.parse(savedState);
      setGameState(savedGameState);
      setCurrentIndex(savedIndex);
      setUserAnswers(savedAnswers);
    }

    const initializeAssessment = async () => {
      try {
        const storedDraft = localStorage.getItem("prismDraft");
        if (!storedDraft) {
          throw new Error(
            "No psychometric profile found. Please retake the Potential Prism.",
          );
        }

        const prismDraft = JSON.parse(storedDraft);
        const prismScoresStr = localStorage.getItem("prismScores");
        const psychometricTraits: Record<string, number> = prismScoresStr
          ? JSON.parse(prismScoresStr)
          : {
              agility: 50,
              risk_tolerance: 50,
              process_adherence: 50,
              analytical_iq: 50,
              creative_abstraction: 50,
              systems_thinking: 50,
              empathy: 50,
              diplomacy: 50,
              leadership: 50,
              autonomy: 50,
              stability_seeking: 50,
              ambition: 50,
            };

        // Timeout + retry
        const controller = new AbortController();
        setTimeout(() => controller.abort(), 10000);

        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/assessment/generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              user_id: getUserId(),
              psychometric_traits: psychometricTraits,
            }),
          },
        );

        if (!response.ok)
          throw new Error("Backend failed to generate assessment");

        const data: SkillAssessmentResponse = await response.json();
        setAssessmentData(data);
        setGameState("playing");
      } catch (error: any) {
        if (error.name === "AbortError") {
          toast.error("Request timeout. Retrying...");
          // Retry once
          setTimeout(() => initializeAssessment(), 2000);
          return;
        }
        console.error("Assessment Init Error:", error);
        toast.error("Failed to generate custom assessment.");
        setGameState("error");
      }
    };

    if (gameState === "loading") initializeAssessment();
  }, [gameState]);

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (showExplanation || !assessmentData || debounceTimer) return;

      // Debounce
      const timer = setTimeout(() => {
        setSelectedChoice(optionId);
        setShowExplanation(true);

        const currentQuestion = assessmentData.dynamic_assessment[currentIndex];
        setUserAnswers((prev) => {
          const newAnswers = [
            ...prev,
            { question_id: currentQuestion.id, selected_option_id: optionId },
          ];
          // Persist
          localStorage.setItem(
            "skillAssessmentState",
            JSON.stringify({
              gameState,
              currentIndex,
              userAnswers: newAnswers,
            }),
          );
          return newAnswers;
        });
        setDebounceTimer(null);
      }, 200);
      setDebounceTimer(timer);
    },
    [showExplanation, assessmentData, currentIndex, gameState, debounceTimer],
  );

  const handleNext = useCallback(() => {
    if (!assessmentData) return;
    // Clear debounce on next
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }

    if (currentIndex < assessmentData.dynamic_assessment.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setShowExplanation(false);
      localStorage.setItem(
        "skillAssessmentState",
        JSON.stringify({
          gameState,
          currentIndex: currentIndex + 1,
          userAnswers,
        }),
      );
    } else {
      finalizeAssessment();
    }
  }, [assessmentData, currentIndex, gameState, userAnswers, debounceTimer]);

  const finalizeAssessment = async () => {
    setGameState("evaluating");

    try {
      const storedDraft = localStorage.getItem("prismDraft");
      if (!storedDraft) throw new Error("No psychometric profile found");
      const prismDraft = JSON.parse(storedDraft);
      const prismScoresStr = localStorage.getItem("prismScores");
      const psychometricTraits: Record<string, number> = prismScoresStr
        ? JSON.parse(prismScoresStr)
        : {
            agility: 50,
            risk_tolerance: 50,
            process_adherence: 50,
            analytical_iq: 50,
            creative_abstraction: 50,
            systems_thinking: 50,
            empathy: 50,
            diplomacy: 50,
            leadership: 50,
            autonomy: 50,
            stability_seeking: 50,
            ambition: 50,
          };

      // Call backend to evaluate answers with timeout
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10000);
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/assessment/evaluate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            user_id: getUserId(),
            psychometric_traits: psychometricTraits,
            answers: userAnswers,
          }),
        },
      );

      if (!response.ok) throw new Error("Backend failed to evaluate answers");

      const data: SkillEvaluationResponse = await response.json();
      setEvaluatedSkills(data);

      // Store the final skills for Phase 2 (The Draft Page)
      localStorage.setItem("verifiedSkills", JSON.stringify(data.top_5_skills));

      toast.success("Skill Verification Complete!");
      setGameState("complete");

      // Navigate to the Interactive Identity Statement
      setTimeout(() => {
        router.push("/identity-statement");
      }, 2500);
    } catch (error) {
      console.error("Evaluation Error:", error);
      toast.error(
        "Failed to grade assessment. Please check backend connection.",
      );
      setGameState("error");
    }
  };

  // --- ERROR STATE ---
  if (gameState === "error") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center space-y-6 max-w-md">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Connection Lost
          </h2>
          <p className="text-slate-500 font-medium">
            We couldn't connect to the AI engine to generate your test.
          </p>
          <Button
            onClick={() => router.push("/potential-prism")}
            className="w-full bg-slate-800 hover:bg-slate-900"
          >
            Return to Start
          </Button>
        </div>
      </div>
    );
  }

  // --- LOADING STATE ---
  if (gameState === "loading") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center space-y-6 max-w-md">
          <BrainCircuit className="w-20 h-20 text-blue-500 animate-pulse mx-auto" />
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Designing Your Challenge...
          </h2>
          <p className="text-slate-500 font-medium">
            Generating personalized skill verification questions based on your
            psychological archetype.
          </p>
          <Progress
            value={100}
            className="w-full h-2 animate-pulse bg-blue-100"
          />
        </div>
      </div>
    );
  }

  // --- EVALUATING STATE ---
  if (gameState === "evaluating") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center space-y-6 max-w-md">
          <Activity className="w-20 h-20 text-blue-500 animate-pulse mx-auto" />
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Verifying Capabilities...
          </h2>
          <p className="text-slate-500 font-medium">
            Grading your responses to establish your true capability baseline.
          </p>
          <Progress
            value={100}
            className="w-full h-2 animate-pulse bg-blue-100"
          />
        </div>
      </div>
    );
  }

  // --- COMPLETE STATE ---
  if (gameState === "complete" && evaluatedSkills) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Verification Complete
          </h2>
          <p className="text-slate-500 font-medium">
            Your hard skills have been mapped. Preparing your editable identity
            draft...
          </p>
        </div>
      </div>
    );
  }

  // --- PLAYING STATE ---
  if (!assessmentData) return null;

  const currentQuestion = assessmentData.dynamic_assessment[currentIndex];
  const progress =
    (currentIndex / assessmentData.dynamic_assessment.length) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Gentle Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between items-end mb-3 px-1">
          <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">
            Capability Check {currentIndex + 1} of{" "}
            {assessmentData.dynamic_assessment.length}
          </span>
          <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full flex items-center gap-1.5 uppercase tracking-wider border border-blue-100">
            <Target className="w-3.5 h-3.5" />
            {currentQuestion.skill_category}
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-200" />
      </div>

      <Card className="w-full max-w-2xl shadow-xl shadow-slate-200/50 border-0 bg-white rounded-[2rem] overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed text-left">
              {currentQuestion.question_context}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedChoice === option.option_id;
              const isCorrect = option.is_correct;
              const showAsCorrect = showExplanation && isCorrect;
              const showAsWrong = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={option.option_id}
                  onClick={() => handleAnswer(option.option_id)}
                  disabled={showExplanation}
                  aria-label={`Select option ${option.option_id}: ${option.text.substring(0, 50)}...`}
                  className={`w-full flex items-start p-5 rounded-2xl border-2 transition-all duration-200 text-left h-24 ${
                    showAsCorrect
                      ? "border-blue-500 bg-blue-50"
                      : showAsWrong
                        ? "border-rose-500 bg-rose-50"
                        : isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-100 hover:border-blue-200 hover:bg-slate-50 bg-white shadow-sm"
                  } ${showExplanation && !showAsCorrect && !showAsWrong ? "opacity-40" : "opacity-100"}`}
                >
                  <div
                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center mr-5 font-bold text-lg transition-colors ${
                      showAsCorrect
                        ? "bg-blue-100 text-blue-600"
                        : showAsWrong
                          ? "bg-rose-100 text-rose-600"
                          : isSelected
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-50 text-slate-400 border border-slate-100"
                    }`}
                  >
                    {showAsCorrect ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : showAsWrong ? (
                      <XCircle className="w-6 h-6" />
                    ) : (
                      option.option_id.toUpperCase()
                    )}
                  </div>
                  <span
                    className={`text-base md:text-lg font-medium leading-snug mt-1 ${
                      showAsCorrect
                        ? "text-blue-900"
                        : showAsWrong
                          ? "text-rose-900"
                          : "text-slate-700"
                    }`}
                  >
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* AI Explanation & Next Button */}
          {showExplanation && (
            <div className="mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    AI Logic
                  </p>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <Button
                  onClick={handleNext}
                  aria-label="Next question or finalize"
                  className="w-full sm:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
                >
                  {currentIndex < assessmentData.dynamic_assessment.length - 1
                    ? "Next Scenario"
                    : "Finalize Test"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
