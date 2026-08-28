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

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-ink selection:bg-blue-dim">
      <BlueprintBackground />
      <AmbientBackground />
      <Seo />
      <Nav />
      <main className="relative z-10">
        <Hero />
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
