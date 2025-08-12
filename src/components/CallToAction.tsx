
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { getCurrentCountryFromPath } from "@/services/countryDetection";
import { motion } from "framer-motion";

const CallToAction = () => {
  const location = useLocation();
  const currentCountry = getCurrentCountryFromPath(location.pathname);
  
  const getNavLink = (basePath: string) => {
    if (currentCountry.code === "SG") return basePath;
    return `/${currentCountry.name.toLowerCase().replace(" ", "-")}${basePath}`;
  };

  return (
    <section className="py-16 bg-gradient-to-r from-kargon-blue to-blue-700">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contact us today to discuss your logistics needs and discover how we can help optimize your supply chain.
          </p>
          <Link to={getNavLink("/contact")}>
            <Button 
              size="lg" 
              className="bg-gc-gold hover:bg-gc-bronze text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Quote Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
