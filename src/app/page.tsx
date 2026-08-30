import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProjectSection from "@/components/ProjectSection";
import Skills from "@/components/Skills";
import ADSurface from "@/components/ADSurface";
import Tools from "@/components/Tools";
import About from "@/components/About";
import Terminal from "@/components/Terminal";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Marquee />
      <ProjectSection />
      <Skills />
      <ADSurface />
      <Tools />
      <About />
      <Terminal />
      <Contact />
    </main>
  );
}
