import domnerkaLogo from "@/assets/domnerka.png";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const NavbarMain = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white">
      <div className="container flex flex-wrap items-center justify-between mx-auto py-4 px-16">
        <a href="#" className="flex items-center">
          <img src={domnerkaLogo} className="h-18" alt="Domnerka Logo" />
        </a>
        <div className="w-50 flex justify-between items-center">
          <Link
            to="#"
            className=" text-black font-semibold px-6 py-2 rounded-full hover:text-primary transition-colors duration-300 ease-out  focus:text-primary"
          >
            Process
          </Link>
          <Link
            to="#"
            className="s text-black font-semibold px-6 py-2 rounded-full hover:text-primary transition-colors duration-300 ease-out focus:text-primary"
          >
            Form
          </Link>
        </div>
        <div className="hidden w-full md:block md:w-auto">
          {isAuthenticated && (
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
