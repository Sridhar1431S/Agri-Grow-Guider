import { Navigation } from "@/components/Navigation";
import { LandingHero } from "@/components/LandingHero";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation hideForGuests={true} />
      <LandingHero />
    </div>
  );
}