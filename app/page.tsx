import Nav from "@/components/Nav";
import MonitorGuyBanner from "@/components/MonitorGuyBanner";
import { Hero, Services, Projects, Process, Cta, Footer } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Services />
      <Projects />
      <MonitorGuyBanner />
      <Process />
      <Cta />
      <Footer />
    </>
  );
}
