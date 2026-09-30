import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Homelab from "./components/Homelab";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import AmbientBackground from "./components/AmbientBackground";
import BlueprintBackground from "./components/BlueprintBackground";
import Seo from "./components/Seo";
import TechMarquee from "./components/TechMarquee";
import { getContent } from "./data/content";
import { useLanguage } from "./context/LanguageContext";

export default function App() {
  const { language } = useLanguage();
  const { skipLink } = getContent(language);
  return (
    <div className="min-h-screen overflow-x-clip bg-bg text-ink selection:bg-blue-dim">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-blue focus:px-4 focus:py-2 focus:font-mono focus:text-[13px] focus:text-bg"
      >
        {skipLink}
      </a>
      <BlueprintBackground />
      <AmbientBackground />
      <Seo />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <TechMarquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Homelab />
        <Contact />
      </main>
    </div>
  );
}
