import Nav from "@/components/Nav";
import { Hero, Services, Projects, Teardown, Process, Cta, Footer } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Services />
      <Projects />
      <Teardown />
      <Process />
      <Cta />
      <Footer />
    </>
  );
}
