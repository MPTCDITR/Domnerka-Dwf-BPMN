import domnerkaLogo from "@/assets/domnerka-landing.webp";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const NavbarLandingPage = () => {
  const { isAuthenticated, logout, login } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-900">
      <div className="container flex flex-wrap items-center justify-between mx-auto py-4 px-16">
        <a href="#" className="flex items-center">
          <img src={domnerkaLogo} className="h-18" alt="Domnerka Logo" />
        </a>
        <div className="hidden w-full md:block md:w-auto">
          {!isAuthenticated ? (
            <Button
              variant="default"
              size="lg"
              className="button-animation text-primary font-semibold relative overflow-hidden
                    group px-4 py-2 text-base sm:text-lg rounded-1 hover:shadow-xl
                    transition-all duration-300 ease-out"
              onClick={login}
            >
              <span className="relative z-10 text-secondary">Login</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 ease-out" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <div className="absolute inset-0 button-glow" />
              </div>
            </Button>
          ) : (
            <Button
              variant="default"
              size="lg"
              className="button-animation text-primary font-semibold relative overflow-hidden
                    group px-4 py-2 text-base sm:text-lg rounded-1 hover:shadow-xl
                    transition-all duration-300 ease-out"
              onClick={handleLogout}
            >
              <span className="relative z-10 text-secondary">Logout</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 ease-out" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <div className="absolute inset-0 button-glow" />
              </div>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
