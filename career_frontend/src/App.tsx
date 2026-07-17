import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import AppLayout from "@/components/layout/AppLayout";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PersonaSelection from "./pages/PersonaSelection";
import PotentialPrism from "./pages/PotentialPrism";
import SkillAssessment from "./pages/SkillAssessment";
import IdentityStatement from "./pages/IdentityStatement";
import SkillSelector from "./pages/SkillSelector";
import GoalDeclaration from "./pages/GoalDeclaration";
import Dashboard from "./pages/Dashboard";
import Roadmap from "./pages/Roadmap";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/*
        This file is part of the old React Router setup.
        Next.js App Router routes are defined under /app.
      */}
      {null}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
