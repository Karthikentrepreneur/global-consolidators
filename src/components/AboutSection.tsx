
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";
import { Link, useLocation } from "react-router-dom";
import { getCurrentCountryFromPath } from "@/services/countryDetection";

const AboutSection = () => {
  const location = useLocation();
  const currentCountry = getCurrentCountryFromPath(location.pathname);
  
  const getNavLink = (basePath: string) => {
    if (currentCountry.code === "SG") return basePath;
    return `/${currentCountry.name.toLowerCase().replace(" ", "-")}${basePath}`;
  };

  const isSriLanka = currentCountry.code === "LK";

  return (
    <section className="bg-slate-100 py-[114px]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">About Us</h2>
              <div className="w-16 h-1 bg-gc-gold mb-6"></div>
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="text-gc-gold shrink-0 mr-3 mt-1" size={20} />
                  <div>
                    <h3 className="font-semibold text-xl mb-3 text-gray-900">15 Years Excellence in Logistics Industry</h3>
                    <p className="text-gray-700 leading-relaxed">
                      GC, a Singapore-based global freight forwarding and logistics solutions provider, establishes its presence in the region with a reliable network of experienced agents spanning the globe. Backed by a highly experienced team of logistics professionals with over 30 years of industry expertise, GC has swiftly emerged as one of the fastest-growing logistics and freight forwarding companies in South East Asia, the Indian subcontinent, and the Middle East.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to={getNavLink("/about-us")}>
                  <Button className="bg-gc-gold hover:bg-gc-bronze text-white rounded-md px-6 py-3">
                    Know More
                  </Button>
                </Link>
                <Link to={getNavLink("/contact")}>
                  <Button variant="outline" className="border-gc-gold text-gc-gold hover:bg-gc-gold hover:text-white rounded-md px-6 py-3">
                    Reach Us
                  </Button>
                </Link>
              </div>
              
              {/* Sri Lanka specific images */}
              {isSriLanka && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ScrollAnimation delay={300} className="relative">
                    <img 
                      alt="GC Sri Lanka Operations" 
                      className="rounded-lg shadow-lg w-full object-cover h-48" 
                      src="/warehousing.png" 
                    />
                  </ScrollAnimation>
                  <ScrollAnimation delay={400} className="relative">
                    <img 
                      alt="GC Sri Lanka Services" 
                      className="rounded-lg shadow-lg w-full object-cover h-48" 
                      src="/oceanfreight.png" 
                    />
                  </ScrollAnimation>
                </div>
              )}
            </ScrollAnimation>
          </div>
          <div className="order-1 lg:order-2">
            <ScrollAnimation delay={200} className="relative">
              <img 
                alt="GC Logistics Operations" 
                className="rounded-lg shadow-lg w-full object-cover" 
                style={{ height: '400px' }} 
                src="/aboutus2.png" 
              />
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
