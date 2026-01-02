import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { OrchestratorProvider } from "./contexts/OrchestratorContext";
import Home from "./pages/Home";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - Cyberpunk Minimalism: Dark theme by default with neon accents
// - Theme is NOT switchable - pure black background with cyan/lime/magenta accents

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <OrchestratorProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </OrchestratorProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
