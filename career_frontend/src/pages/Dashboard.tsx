"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BrainCircuit,
  Briefcase,
  Zap,
  Target,
  Compass,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

interface JobMatch {
  role_name: string;
  match_percentage: number;
  why_it_fits: string;
  core_domain: string;
}

interface UserDraft {
  archetype_title: string;
  psychological_profile: string;
  core_traits: string[];
  hidden_potential: string;
  work_environment: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [draft, setDraft] = useState<UserDraft | null>(null);
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve the AI-generated data from the previous steps
    const storedDraft = localStorage.getItem("prismDraft");
    const storedMatches = localStorage.getItem("finalMatches");

    if (storedDraft && storedMatches) {
      setDraft(JSON.parse(storedDraft));
      setMatches(JSON.parse(storedMatches));
      setIsLoading(false);
    } else {
      // If data is missing, send them back to the start
      router.push("/potential-prism");
    }
  }, [navigate]);

  if (isLoading || !draft) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <BrainCircuit className="w-10 h-10 text-blue-500 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
              Your Career Graph
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Based on your cognitive instincts and verified skills.
            </p>
          </div>
          <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Analysis Complete
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: The Psychological Profile */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-[2rem]">
              <div className="mb-6">
                <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">
                  Your Archetype
                </span>
                <h2 className="text-3xl font-bold mt-2 leading-tight">
                  {draft.archetype_title}
                </h2>
              </div>

              <p className="text-slate-300 leading-relaxed mb-8">
                {draft.psychological_profile}
              </p>

              <div className="space-y-6">
                <div>
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                    <Zap className="w-4 h-4 text-yellow-400" /> Core Traits
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {draft.core_traits?.map((trait, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Target className="w-4 h-4 text-rose-400" /> Hidden
                    Potential
                  </span>
                  <p className="text-sm text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    {draft.hidden_potential}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN: The Job Matches */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              Your Top Career Matches
            </h3>

            <div className="grid gap-4">
              {matches.map((job, index) => (
                <Card
                  key={index}
                  className="p-6 border-0 shadow-lg bg-white rounded-[1.5rem] hover:shadow-xl transition-shadow group relative overflow-hidden"
                >
                  {/* Highlight for the #1 Match */}
                  {index === 0 && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
                  )}

                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full uppercase tracking-wider">
                          {job.core_domain}
                        </span>
                        {index === 0 && (
                          <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                            <Compass className="w-3 h-3" /> Best Fit
                          </span>
                        )}
                      </div>
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">
                        {job.role_name}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {job.why_it_fits}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center min-w-[120px] bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-3xl font-black text-slate-800">
                        {job.match_percentage}%
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Match
                      </span>
                    </div>
                  </div>

                  {/* Generate Roadmap Button */}
                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() =>
                        toast.info(`Generating roadmap for ${job.role_name}...`)
                      }
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl transition-colors"
                    >
                      Build Career Roadmap
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
