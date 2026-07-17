import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BrainCircuit,
  Sparkles,
  Zap,
  Users,
  ShieldAlert,
  Activity,
  MessageSquareHeart,
  Scale,
  Trophy,
  Flame,
  Target,
  Star,
  Play,
  Award,
  Cpu,
  Heart,
  Zap as ZapIcon,
  Shield,
  Crosshair,
  Gauge,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- THE 12-TRAIT PSYCHOMETRIC INTERFACES ---
interface ComprehensiveTraits {
  agility: number;
  risk_tolerance: number;
  process_adherence: number;
  analytical_iq: number;
  creative_abstraction: number;
  systems_thinking: number;
  empathy: number;
  diplomacy: number;
  leadership: number;
  autonomy: number;
  stability_seeking: number;
  ambition: number;
}

interface Choice {
  text: string;
  icon?: React.ReactNode;
  impact: Partial<ComprehensiveTraits>;
}

interface Scenario {
  id: string;
  context: string;
  choices: Choice[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

// --- THE GENTLE SCENARIO BANK ---
const activeBank: Scenario[] = [
  // --- Scenarios (Formerly Crisis) ---
  {
    id: "c1",
    context:
      "You are the lead organizer of the school's Annual Day. It's 10:00 AM, the auditorium is packed, and the main DJ's laptop completely crashes just as the chief guest walks in.",
    choices: [
      {
        text: "Instantly play a Spotify playlist from my phone to buy us 10 minutes.",
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        impact: { agility: 20, risk_tolerance: 10 },
      },
      {
        text: "Sprint to the AV room, secure the backup laptop, and systematically reboot.",
        icon: <BrainCircuit className="w-5 h-5 text-blue-500" />,
        impact: { process_adherence: 20, systems_thinking: 10 },
      },
      {
        text: "Grab the microphone and start a crowd chant to keep the energy high.",
        icon: <Users className="w-5 h-5 text-orange-500" />,
        impact: { leadership: 20, risk_tolerance: 15 },
      },
    ],
  },
  {
    id: "c2",
    context:
      "You just won a local hackathon and received ₹50,000 as prize money. You have a free weekend ahead of you. What is your immediate instinct?",
    choices: [
      {
        text: "Put it in savings, catch up on sleep, and prepare for upcoming exams.",
        icon: <ShieldAlert className="w-5 h-5 text-green-600" />,
        impact: { stability_seeking: 25, process_adherence: 10 },
      },
      {
        text: "Buy a 3D printer and spend the weekend alone building a new prototype.",
        icon: <Sparkles className="w-5 h-5 text-purple-500" />,
        impact: { autonomy: 25, creative_abstraction: 15 },
      },
      {
        text: "Throw a celebration party for my friends and network with other developers.",
        icon: <Users className="w-5 h-5 text-orange-500" />,
        impact: { leadership: 15, diplomacy: 15 },
      },
    ],
  },
  {
    id: "c3",
    context:
      "A fake rumor is spreading on your class WhatsApp group that the final exams are being preponed, causing mass panic among students.",
    choices: [
      {
        text: "Mute the group, focus on my own studying, and adapt to whatever happens.",
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        impact: { autonomy: 20, stability_seeking: 10 },
      },
      {
        text: "Message the principal, get the official circular, and pin the proof to the group.",
        icon: <Scale className="w-5 h-5 text-blue-500" />,
        impact: { analytical_iq: 15, leadership: 15 },
      },
      {
        text: "Call the most panicked students individually to gently calm them down.",
        icon: <MessageSquareHeart className="w-5 h-5 text-pink-500" />,
        impact: { empathy: 20, diplomacy: 15 },
      },
    ],
  },

  // --- Scenarios (Formerly Puzzle - Rewritten for comfort and clarity) ---
  {
    id: "p1",
    context:
      "You are working on a group project building a model solar car. During a test run, it suddenly stops moving. The final presentation is in one hour.",
    choices: [
      {
        text: "Carefully trace the wiring step-by-step to locate the exact problem.",
        icon: <Activity className="w-5 h-5 text-blue-500" />,
        impact: { analytical_iq: 25, systems_thinking: 15 },
      },
      {
        text: "Swap the motor with a spare one just to ensure it runs for the judges.",
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        impact: { agility: 20, stability_seeking: 10 },
      },
      {
        text: "Change the presentation pitch to focus entirely on its design instead of movement.",
        icon: <Sparkles className="w-5 h-5 text-purple-500" />,
        impact: { creative_abstraction: 25, diplomacy: 10 },
      },
    ],
  },
  {
    id: "p2",
    context:
      "You are managing the funds for the college fest. You realize there is a ₹15,000 shortage, and the stage vendors need to be paid by tomorrow morning.",
    choices: [
      {
        text: "Sit down and audit all the receipts from the last month to find the exact math error.",
        icon: <BrainCircuit className="w-5 h-5 text-slate-500" />,
        impact: { analytical_iq: 25, process_adherence: 20 },
      },
      {
        text: "Quickly pitch three local businesses for fast, last-minute sponsorships.",
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        impact: { agility: 20, ambition: 15 },
      },
      {
        text: "Gather the core committee, explain the issue transparently, and ask everyone to chip in.",
        icon: <Users className="w-5 h-5 text-blue-500" />,
        impact: { leadership: 15, diplomacy: 15 },
      },
    ],
  },
  {
    id: "p3",
    context:
      "The food vendor for the farewell party suddenly cancels. 200 students will be arriving expecting dinner in just three hours.",
    choices: [
      {
        text: "Order bulk pizzas from five different local places to spread the risk.",
        icon: <Zap className="w-5 h-5 text-yellow-500" />,
        impact: { agility: 20, risk_tolerance: 15 },
      },
      {
        text: "Send a few juniors to local bakeries to quickly buy whatever snacks are available.",
        icon: <Users className="w-5 h-5 text-blue-500" />,
        impact: { leadership: 20, systems_thinking: 10 },
      },
      {
        text: "Announce the delay honestly and start an impromptu dance-off to distract everyone.",
        icon: <Sparkles className="w-5 h-5 text-purple-500" />,
        impact: { creative_abstraction: 20, diplomacy: 15 },
      },
    ],
  },

  // --- Scenarios (Formerly Conflict) ---
  {
    id: "eq1",
    context:
      "A teammate texts you: 'I haven't started my section of the project due tomorrow. I'm too stressed and I can't do this right now. I am so sorry.'",
    choices: [
      {
        text: "I'll stay up and do it myself. We can't let our final grade drop.",
        icon: <ShieldAlert className="w-5 h-5 text-slate-500" />,
        impact: { process_adherence: 15, stability_seeking: 15 },
      },
      {
        text: "Let's quickly split their work among the rest of the team. We need to move fast.",
        icon: <Users className="w-5 h-5 text-blue-500" />,
        impact: { leadership: 20, agility: 10 },
      },
      {
        text: "Call them privately, ask what's wrong, and help them finish just a small part.",
        icon: <MessageSquareHeart className="w-5 h-5 text-pink-500" />,
        impact: { empathy: 25, diplomacy: 10 },
      },
    ],
  },
  {
    id: "eq2",
    context:
      "During a presentation, a classmate nervously uses the exact research data you spent three days compiling, making it sound to the teacher like they did the work.",
    choices: [
      {
        text: "Politely interrupt to clarify: 'Just to add to the data I compiled...'",
        icon: <Scale className="w-5 h-5 text-slate-600" />,
        impact: { ambition: 20, process_adherence: 10 },
      },
      {
        text: "Say nothing now, but quietly email the teacher the proof of your work after class.",
        icon: <BrainCircuit className="w-5 h-5 text-blue-500" />,
        impact: { diplomacy: 25, analytical_iq: 10 },
      },
      {
        text: "Let them have the win. They were panicking, and the overall team gets an A anyway.",
        icon: <Heart className="w-5 h-5 text-rose-500" />,
        impact: { empathy: 20, stability_seeking: 15 },
      },
    ],
  },
  {
    id: "eq3",
    context:
      "Your best friend has been snapping at you aggressively all week. You know they are currently failing math and their parents are very strict about grades.",
    choices: [
      {
        text: "Give them space to cool off, but quietly email them my math study notes.",
        icon: <BrainCircuit className="w-5 h-5 text-blue-500" />,
        impact: { analytical_iq: 15, diplomacy: 15 },
      },
      {
        text: "Take them for coffee, ignore their bad mood, and gently ask what's happening at home.",
        icon: <MessageSquareHeart className="w-5 h-5 text-pink-500" />,
        impact: { empathy: 25, leadership: 10 },
      },
      {
        text: "Confront them about their attitude, but immediately offer to tutor them in math.",
        icon: <Users className="w-5 h-5 text-orange-500" />,
        impact: { leadership: 20, process_adherence: 10 },
      },
    ],
  },
];

// --- ACHIEVEMENTS (Kept for backend/results tracking) ---
const initialAchievements: Achievement[] = [
  {
    id: "insight_seeker",
    name: "Insight Seeker",
    description: "Completed the first phase",
    icon: <Shield className="w-5 h-5" />,
    unlocked: false,
  },
  {
    id: "deep_thinker",
    name: "Deep Thinker",
    description: "Navigated complex scenarios",
    icon: <Cpu className="w-5 h-5" />,
    unlocked: false,
  },
  {
    id: "empathy_champion",
    name: "Heart & Mind",
    description: "Balanced logic with empathy",
    icon: <Heart className="w-5 h-5" />,
    unlocked: false,
  },
  {
    id: "streak_3",
    name: "In the Flow",
    description: "Answered 3 questions instinctively",
    icon: <Flame className="w-5 h-5" />,
    unlocked: false,
  },
  {
    id: "perfect_score",
    name: "Self-Aware",
    description: "Completed the full assessment",
    icon: <Star className="w-5 h-5" />,
    unlocked: false,
  },
];

const traitConfig: {
  key: keyof ComprehensiveTraits;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    key: "agility",
    label: "Agility",
    icon: <ZapIcon className="w-3 h-3" />,
    color: "text-yellow-500",
  },
  {
    key: "risk_tolerance",
    label: "Risk",
    icon: <Crosshair className="w-3 h-3" />,
    color: "text-red-500",
  },
  {
    key: "process_adherence",
    label: "Process",
    icon: <Gauge className="w-3 h-3" />,
    color: "text-blue-500",
  },
  {
    key: "analytical_iq",
    label: "Analysis",
    icon: <BrainCircuit className="w-3 h-3" />,
    color: "text-purple-500",
  },
  {
    key: "creative_abstraction",
    label: "Creativity",
    icon: <Sparkles className="w-3 h-3" />,
    color: "text-pink-500",
  },
  {
    key: "systems_thinking",
    label: "Systems",
    icon: <Cpu className="w-3 h-3" />,
    color: "text-indigo-500",
  },
  {
    key: "empathy",
    label: "Empathy",
    icon: <Heart className="w-3 h-3" />,
    color: "text-rose-500",
  },
  {
    key: "diplomacy",
    label: "Diplomacy",
    icon: <Scale className="w-3 h-3" />,
    color: "text-teal-500",
  },
  {
    key: "leadership",
    label: "Leadership",
    icon: <Compass className="w-3 h-3" />,
    color: "text-orange-500",
  },
  {
    key: "autonomy",
    label: "Autonomy",
    icon: <Star className="w-3 h-3" />,
    color: "text-amber-500",
  },
  {
    key: "stability_seeking",
    label: "Stability",
    icon: <Shield className="w-3 h-3" />,
    color: "text-green-500",
  },
  {
    key: "ambition",
    label: "Ambition",
    icon: <Trophy className="w-3 h-3" />,
    color: "text-violet-500",
  },
];

export default function PotentialPrism() {
  const router = useRouter();
  const [gameState, setGameState] = useState<"intro" | "playing" | "results">(
    "intro",
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComputing, setIsComputing] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Internal tracking (hidden from user to reduce anxiety)
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] =
    useState<Achievement[]>(initialAchievements);
  const [startTime] = useState(Date.now());

  const [scores, setScores] = useState<ComprehensiveTraits>({
    agility: 0,
    risk_tolerance: 0,
    process_adherence: 0,
    analytical_iq: 0,
    creative_abstraction: 0,
    systems_thinking: 0,
    empathy: 0,
    diplomacy: 0,
    leadership: 0,
    autonomy: 0,
    stability_seeking: 0,
    ambition: 0,
  });

  const getTopTraits = useCallback(() => {
    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    return sorted.map(([key]) => key);
  }, [scores]);

  const checkAchievements = useCallback(() => {
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.unlocked) return ach;
        let shouldUnlock = false;
        if (ach.id === "insight_seeker" && currentIndex >= 2)
          shouldUnlock = true;
        if (ach.id === "deep_thinker" && currentIndex >= 5) shouldUnlock = true;
        if (ach.id === "empathy_champion" && currentIndex >= 8)
          shouldUnlock = true;
        if (ach.id === "streak_3" && streak >= 3) shouldUnlock = true;
        if (
          ach.id === "perfect_score" &&
          currentIndex === activeBank.length - 1
        )
          shouldUnlock = true;
        return shouldUnlock ? { ...ach, unlocked: true } : ach;
      }),
    );
  }, [streak, currentIndex]);

  useEffect(() => {
    checkAchievements();
  }, [checkAchievements]);

  const handleChoice = (choiceIndex: number) => {
    if (showFeedback) return;

    setSelectedChoice(choiceIndex);
    setShowFeedback(true);

    const choice = currentScenario.choices[choiceIndex];
    const choicePoints = Object.values(choice.impact).reduce(
      (a: number, b: number) => a + (b || 0),
      0,
    );

    const streakBonus =
      streak > 0 ? Math.floor(choicePoints * 0.1 * streak) : 0;
    setTotalPoints((prev) => prev + choicePoints + streakBonus);
    setStreak((prev) => prev + 1);

    setScores((prev) => ({
      agility: prev.agility + (choice.impact.agility || 0),
      risk_tolerance: prev.risk_tolerance + (choice.impact.risk_tolerance || 0),
      process_adherence:
        prev.process_adherence + (choice.impact.process_adherence || 0),
      analytical_iq: prev.analytical_iq + (choice.impact.analytical_iq || 0),
      creative_abstraction:
        prev.creative_abstraction + (choice.impact.creative_abstraction || 0),
      systems_thinking:
        prev.systems_thinking + (choice.impact.systems_thinking || 0),
      empathy: prev.empathy + (choice.impact.empathy || 0),
      diplomacy: prev.diplomacy + (choice.impact.diplomacy || 0),
      leadership: prev.leadership + (choice.impact.leadership || 0),
      autonomy: prev.autonomy + (choice.impact.autonomy || 0),
      stability_seeking:
        prev.stability_seeking + (choice.impact.stability_seeking || 0),
      ambition: prev.ambition + (choice.impact.ambition || 0),
    }));

    setTimeout(() => {
      if (currentIndex < activeBank.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedChoice(null);
        setShowFeedback(false);
      } else {
        finalizeAssessment();
      }
    }, 800);
  };

  const finalizeAssessment = async () => {
    setIsComputing(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/prism/calculate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "student_mvp_01",
            persona: "First Stepper",
            final_scores: scores,
          }),
        },
      );

      if (!response.ok) throw new Error("Backend connection failed");
      const data = await response.json();

      localStorage.setItem("prismDraft", JSON.stringify(data));
      localStorage.setItem("prismScores", JSON.stringify(scores));
      setGameState("results");
      setTimeout(() => {
        toast.success("Cognitive Profile Synthesized Successfully!");
        router.push("/skill-assessment");
      }, 2500);
    } catch (error) {
      console.error("AI Synthesis Error:", error);
      toast.error("Failed to map profile. Ensure FastAPI is running.");
      setIsComputing(false);
    }
  };

  const currentScenario = activeBank[currentIndex];
  const progress = (currentIndex / activeBank.length) * 100;

  // --- RENDER INTRO SCREEN (Gentle & Welcoming) ---
  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-2xl w-full space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">
              Potential Prism
            </h1>
            <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
              Discover your natural strengths in a stress-free space. There are
              no right or wrong answers—just your unique perspective.
            </p>
          </div>

          <Card className="bg-white border-0 shadow-xl shadow-slate-200/50 p-8 rounded-[2rem] space-y-8">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              What to Expect
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <BrainCircuit className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="font-semibold text-slate-800">
                  Relatable Scenarios
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Everyday situations, not academic tests.
                </p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <Heart className="w-8 h-8 text-rose-500 mb-3" />
                <h3 className="font-semibold text-slate-800">No Judgement</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Answer based on your gut instinct.
                </p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <Compass className="w-8 h-8 text-emerald-500 mb-3" />
                <h3 className="font-semibold text-slate-800">Stress-Free</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Take your time. No ticking clocks.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setGameState("playing")}
              className="w-full py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98]"
            >
              <Play className="w-5 h-5 mr-2" />
              Begin Exploration
            </Button>

            <p className="text-center text-slate-400 text-sm font-medium">
              Trust your intuition. We are just mapping how your mind works.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // --- RENDER COMPUTING SCREEN (Soft & Calming) ---
  if (isComputing) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <BrainCircuit className="w-20 h-20 text-blue-500 animate-pulse mx-auto" />
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Understanding You...
          </h2>
          <p className="text-slate-500 font-medium">
            Our AI is carefully mapping your unique cognitive patterns based on
            your choices.
          </p>
          <Progress
            value={100}
            className="w-full h-2 animate-pulse bg-blue-100"
          />
        </div>
      </div>
    );
  }

  // --- RENDER RESULTS PREVIEW (Clean & Reassuring) ---
  if (gameState === "results") {
    const topTraits = getTopTraits();
    const unlockedAchievements = achievements.filter((a) => a.unlocked);

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-2xl w-full space-y-6">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-2">
              <Star className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              Exploration Complete
            </h1>
            <p className="text-slate-500">
              Thank you for being authentic. Your profile is ready.
            </p>
          </div>

          <Card className="bg-white border-0 shadow-xl shadow-slate-200/50 p-8 rounded-[2rem]">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              Your Natural Instincts
            </h2>

            <div className="space-y-5">
              {topTraits.map((traitKey) => {
                const config = traitConfig.find((t) => t.key === traitKey);
                const value = scores[traitKey as keyof ComprehensiveTraits];
                const maxValue = Math.max(...Object.values(scores));
                const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

                return (
                  <div key={traitKey} className="space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-slate-700 flex items-center gap-2">
                        <span className={config?.color}>{config?.icon}</span>
                        {config?.label}
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {unlockedAchievements.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3">
              {unlockedAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-full"
                >
                  <span className="text-blue-500">{ach.icon}</span>
                  <span className="text-sm font-medium text-slate-600">
                    {ach.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-blue-500 text-sm font-medium animate-pulse mt-8">
            Taking you to your full career dashboard...
          </p>
        </div>
      </div>
    );
  }

  // --- RENDER GAMEPLAY (Seamless White Card Flow) ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Gentle Progress Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between items-end mb-3 px-1">
          <span className="text-sm font-bold tracking-widest text-slate-400 uppercase">
            Scenario {currentIndex + 1} of {activeBank.length}
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-200" />
      </div>

      {/* Standardized White Card */}
      <Card className="w-full max-w-2xl shadow-xl shadow-slate-200/50 border-0 bg-white rounded-[2rem] overflow-hidden">
        <div className="p-8 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed mb-10 text-left">
            {currentScenario.context}
          </h2>

          <div className="space-y-4">
            {currentScenario.choices.map((choice, index) => {
              const isSelected = selectedChoice === index;

              return (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  disabled={showFeedback}
                  className={`w-full flex items-start p-5 rounded-2xl border-2 transition-all duration-200 group text-left ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-slate-100 hover:border-blue-200 hover:bg-slate-50 bg-white"
                  } ${showFeedback && !isSelected ? "opacity-40" : "opacity-100"}`}
                >
                  <div
                    className={`p-3 rounded-xl mr-5 mt-0.5 transition-colors ${
                      isSelected
                        ? "bg-blue-100"
                        : "bg-slate-50 group-hover:bg-white border border-slate-100"
                    }`}
                  >
                    {choice.icon}
                  </div>
                  <span
                    className={`text-base md:text-lg font-medium leading-snug ${
                      isSelected ? "text-blue-900" : "text-slate-700"
                    }`}
                  >
                    {choice.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="mt-8 text-center space-y-1">
        <p className="text-sm font-medium text-slate-400">
          Take a deep breath.
        </p>
        <p className="text-sm font-medium text-slate-400">
          Choose the option that feels most like 'you'.
        </p>
      </div>
    </div>
  );
}
