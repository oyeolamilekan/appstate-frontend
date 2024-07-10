'use client'

import { Feature, Hero, Navigation } from "@/components/landing-page";
import Footer from "@/components/landing-page/footer";
import Integrations from "@/components/landing-page/integrations";

export default function LandingPage() {
  return (
    <main className="dark:bg-black">
      <Navigation />
      <Hero />
      <Feature />
      <Integrations />
      <Footer />
    </main>
  );
}
