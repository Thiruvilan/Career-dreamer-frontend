"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Brain,
  Compass,
  Sparkles,
  Target,
  Users,
  Lightbulb,
} from "lucide-react";

const personas = [
  {
    type: "future-builder",
    icon: Target,
    title: "The Future Builder",
    emoji: "🎯",
    description: "I have a dream career in mind",
    question: "How do I get there?",
    details:
      "You know what you want to become and need a clear, step-by-step plan to make it happen.",
    color: "from-primary to-primary-glow",
    path: "/goal-declaration",
  },
  {
    type: "choice-maker",
    icon: Users,
    title: "The Choice Maker",
    emoji: "🤹",
    description: "I have many talents and skills",
    question: "Which path should I choose?",
    details:
      "You're multi-talented and need help finding the single best career that fits all your skills.",
    color: "from-secondary to-secondary-glow",
    path: "/skill-selector",
  },
  {
    type: "first-stepper",
    icon: Lightbulb,
    title: "The First-Stepper",
    emoji: "🌟",
    description: "I'm just starting to explore",
    question: "What can I be?",
    details:
      "You're at the beginning of your journey and need a guide to explore amazing career possibilities.",
    color: "from-accent to-accent-glow",
    path: "/potential-prism",
  },
];

const PersonaSelection = () => {
  const router = useRouter();

  const handlePersonaSelect = (persona: (typeof personas)[0]) => {
    // Store selected persona in localStorage for later use
    localStorage.setItem("selectedPersona", JSON.stringify(persona));
    router.push(persona.path);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Project Beacon</h1>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold">
            Which describes you best?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your mindset to get a personalized career guidance experience
            tailored just for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {personas.map((persona, index) => (
            <Card
              key={persona.type}
              className="glass p-8 hover:shadow-glow transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
              onClick={() => handlePersonaSelect(persona)}
            >
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl">{persona.emoji}</div>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${persona.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <persona.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="text-center space-y-3">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {persona.title}
                  </h3>
                  <p className="text-muted-foreground">{persona.description}</p>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-primary font-medium italic">
                      "{persona.question}"
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {persona.details}
                  </p>
                </div>

                <Button
                  className="w-full"
                  variant="hero"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePersonaSelect(persona);
                  }}
                >
                  Start My Journey
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Don't worry, you can always change your mind later!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaSelection;
