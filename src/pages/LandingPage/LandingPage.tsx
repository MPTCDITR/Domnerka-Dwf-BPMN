import HeroSection from "./HeroSection";
import { NavbarLandingPage } from "@/components/NavbarLandingPage/NavbarLandingPage";

export const LandingPage = () => {

  return (
    <>
      <main>
        <NavbarLandingPage/>
        <HeroSection/>
      </main>
    </>
  );
};