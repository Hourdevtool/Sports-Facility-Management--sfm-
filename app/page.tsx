import Header from "./components/landing/Header";
import HowItWorks from "./components/landing/HowItWorks";
import Info from "./components/landing/Info";
import SectionIndicator from "./components/landing/SectionIndicator";

export default function Home() {
  return (
    <main className="relative">
      <Header />
      <HowItWorks />
      <Info />
      <SectionIndicator />
    </main>
  );
}

