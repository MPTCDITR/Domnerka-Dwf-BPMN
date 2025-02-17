import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HeroSection() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="min-h-screen gradient-animation overflow-hidden bg-blue-900">
      <div className="container mx-auto px-16 min-h-screen flex items-center py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center w-full">
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1">
            <h1 className="fade-in-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="text-secondary">Domnerka</span>
              <span className="text-primary"> BPMN</span>
            </h1>
            <p className="fade-in-up delay-200 text-white/90 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Domnerka are web applications that digitalize and streamline work
              processes and help ensure that tasks are completed in a timely,
              accurate, and organized manner. Execute processes, user completing
              tasks, filling out form, workflow and task delegation.
            </p>
            <div className="fade-in-up delay-400 pt-4">
              {!isAuthenticated ? (
                <Button
                  variant="secondary"
                  size="lg"
                  className="button-animation text-primary font-semibold relative overflow-hidden
                    group px-8 py-3 text-base sm:text-lg rounded-full hover:shadow-xl
                    transition-all duration-300 ease-out"
                  onClick={login}
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 ease-out" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                    <div className="absolute inset-0 button-glow" />
                  </div>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  className="button-animation text-primary font-semibold relative overflow-hidden
                    group px-8 py-3 text-base sm:text-lg rounded-full hover:shadow-xl
                    transition-all duration-300 ease-out"
                  onClick={() => navigate("/home")}
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 ease-out" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                    <div className="absolute inset-0 button-glow" />
                  </div>
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - SVG Illustration */}
          <div className="fade-in-up delay-600 relative order-1 lg:order-2">
            <div className="relative w-full aspect-square max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto transform hover:scale-105 transition-all duration-500 ease-out">
              <div className="absolute inset-0 bg-secondary/5 rounded-full blur-3xl scale-95 animate-pulse-slow" />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/devices-animate-5B0fNaalHAwtiEDZ0OrqLNSkRzeCFN.svg"
                alt="Digital workflow illustration"
                className="object-contain animate-float drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
