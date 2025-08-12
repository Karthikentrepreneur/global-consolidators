
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Truck, Ship, Globe, Users, Award, TrendingUp, CheckCircle, Star } from "lucide-react";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const ScrollToTop = () => {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);
  return null;
};

const AboutUs = () => {
  const location = useLocation();
  const currentCountry = getCurrentCountryFromPath(location.pathname);
  const isSriLanka = currentCountry.code === "LK";
  
  const getNavLink = (basePath: string) => {
    if (currentCountry.code === "SG") return basePath;
    return `/${currentCountry.name.toLowerCase().replace(" ", "-")}${basePath}`;
  };

  const stats = [{
    number: "15+",
    label: "Years Experience",
    icon: TrendingUp
  }, {
    number: "500+",
    label: "Global Clients",
    icon: Users
  }, {
    number: "50+",
    label: "Countries Served",
    icon: Globe
  }, {
    number: "99%",
    label: "Customer Satisfaction",
    icon: Award
  }];
  const features = ["Global freight forwarding expertise", "Reliable network of agents", "30+ years industry experience", "Dedicated warehouse facilities", "Own fleet of trucks", "Strategic location advantages"];
  
  return <div className="bg-white text-gray-900 min-h-screen flex flex-col">
      <ScrollToTop />
      <Navigation />
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} viewport={{
            once: true
          }} className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                About <span className="text-kargon-red">GC</span>
              </h1>
              <p className="text-xl max-w-3xl mx-auto leading-relaxed text-gray-700">
                Your premier global freight forwarding and logistics solutions provider
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              {/* Text Section */}
              <motion.div initial={{
              opacity: 0,
              x: -50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8,
              delay: 0.2
            }} viewport={{
              once: true
            }} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold mb-4 text-kargon-blue">15 Years Excellence in Logistics Industry</h2>
                  <p className="text-lg leading-relaxed text-gray-700">
                    GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Our competitive advantage lies in our dedicated warehouse facilities and owned fleet of trucks strategically located at key hubs, enabling us to deliver top-notch logistics services to our valued customers.
                  </p>
                </div>

                <Link to={getNavLink("/contact")} className="inline-block pt-4">
                  
                </Link>
              </motion.div>

              {/* Image Section */}
              <motion.div initial={{
              opacity: 0,
              x: 50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8,
              delay: 0.4
            }} viewport={{
              once: true
            }} className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img alt="GC Operations" loading="lazy" className="w-full h-96 object-cover" src="/customclearance.png" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="absolute -bottom-6 -right-6 p-4 rounded-xl shadow-lg bg-kargon-red">
                  <Ship className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sri Lanka specific content blocks */}
        {isSriLanka && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* First content block */}
              <motion.div initial={{
                opacity: 0,
                y: 30
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.8
              }} viewport={{
                once: true
              }} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-kargon-blue">Our Sri Lankan Operations</h2>
                  <p className="text-lg leading-relaxed text-gray-700">
                    GC Sri Lanka has established itself as a trusted logistics partner in the region, providing comprehensive freight forwarding and logistics solutions. Our local expertise combined with global reach ensures seamless operations for businesses across various industries.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    We maintain state-of-the-art facilities and employ cutting-edge technology to streamline your supply chain operations, ensuring efficiency and reliability in every shipment.
                  </p>
                </div>
                <div className="relative">
                  <img alt="GC Sri Lanka Warehouse" className="w-full h-80 object-cover rounded-2xl shadow-lg" src="/warehousing.png" />
                </div>
              </motion.div>

              {/* Second content block */}
              <motion.div initial={{
                opacity: 0,
                y: 30
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.8,
                delay: 0.2
              }} viewport={{
                once: true
              }} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 relative">
                  <img alt="GC Sri Lanka Sea Freight" className="w-full h-80 object-cover rounded-2xl shadow-lg" src="/oceanfreight.png" />
                </div>
                <div className="order-1 md:order-2 space-y-6">
                  <h2 className="text-3xl font-bold text-kargon-blue">Strategic Location Advantage</h2>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Located at the crossroads of major shipping lanes, Sri Lanka offers unique advantages for international trade. Our strategic positioning enables efficient connectivity to major markets across Asia, Europe, and beyond.
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    Our team of experienced professionals understands the local market dynamics and regulatory requirements, ensuring smooth customs clearance and documentation processes for all your shipments.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        <section className="py-20 bg-slate-50">
          
        </section>
      </main>

      <Footer />
    </div>;
};

export default AboutUs;
