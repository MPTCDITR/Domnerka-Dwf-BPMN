import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen py-8 overflow-hidden flex items-center justify-center bg-blue-900">
      <div className="container mx-auto px-4 text-center">
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold text-primary animate-bounce-slow">
            4
            <span className="text-secondary inline-block animate-spin-slow">
              0
            </span>
            4
          </h1>

          <p className="text-2xl md:text-3xl text-secondary max-w-xl mx-auto fade-in-up">
            Oops! It seems you've ventured into uncharted digital territory.
          </p>

          <div className="fade-in-up delay-200">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="button-animation text-primary font-semibold relative overflow-hidden 
                group px-8 py-3 text-lg rounded-full hover:shadow-xl
                transition-all duration-300 ease-out"
            >
              <a href="/">
                <span className="relative z-10">Return to Home</span>
                <div
                  className="absolute inset-0 bg-white/0 group-hover:bg-white/10 
                  transition-colors duration-300 ease-out"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                  <div className="absolute inset-0 button-glow" />
                </div>
              </a>
            </Button>
          </div>
        </div>

        {mounted && (
          <div className="mt-12 relative">
            <svg
              className="w-full max-w-lg mx-auto text-secondary animate-float"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,89.1,-0.5C88.1,15.3,83.5,30.5,74.3,41.8C65.1,53.1,51.3,60.4,37.6,67.1C23.9,73.7,11.9,79.6,-1.7,82.5C-15.3,85.4,-30.6,85.4,-43.8,79.7C-57,74,-68,62.7,-76.3,49.6C-84.6,36.5,-90.1,21.7,-91.6,6.1C-93.1,-9.4,-90.5,-25.7,-83,-39.3C-75.5,-52.9,-63.1,-63.8,-49,-71.7C-34.9,-79.6,-19.2,-84.5,-2.6,-80.6C14,-76.7,30.5,-83.6,44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl animate-bounce">🚀</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
