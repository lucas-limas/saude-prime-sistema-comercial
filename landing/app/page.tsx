import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import OperatorsCarousel from "@/components/OperatorsCarousel";
import ProductShowcase from "@/components/ProductShowcase";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <OperatorsCarousel />
      <ProductShowcase />
      <Features />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
