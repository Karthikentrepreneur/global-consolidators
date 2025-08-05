import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import CountryHeroSection from "@/components/CountryHeroSection";
import TrackOrder from "@/components/TrackOrder";
import CountryServicesCards from "@/components/CountryServicesCards";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import WorkflowSection from "@/components/WorkflowSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import UpdatesSection from "@/components/UpdatesSection";
import GlobalPresence from "@/components/GlobalPresence";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop"; // ✅ Import the hook

const MalaysiaHome = () => {
  useScrollToTop(); // ✅ Call the hook at the top of the component

  useEffect(() => {
    const handleScroll = () => {
      const scrollAnimElements = document.querySelectorAll('.scroll-animate');
      scrollAnimElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.9) {
          element.classList.add('appear');
        }
      });
    };

    setTimeout(handleScroll, 100);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-white">
      <Navigation />
      <CountryHeroSection country="malaysia" />
      <TrackOrder />
      <AboutSection />
      <ServicesSection />
      <WorkflowSection />
      <GlobalPresence />
      <UpdatesSection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default MalaysiaHome;
