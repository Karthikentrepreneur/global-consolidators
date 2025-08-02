import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Plane, Clock, Globe, Shield, CheckCircle } from "lucide-react";

const AirFreight = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    "Express delivery worldwide",
    "Real-time tracking",
    "Cargo insurance coverage",
    "Customs clearance support",
    "Temperature-controlled shipping",
    "24/7 customer support"
  ];

  return (
    <div className="bg-white text-black min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 bg-red-600/20 px-6 py-3 rounded-full mb-6">
              <Plane className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">Air Freight Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Air Freight <span className="text-red-500">Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
               Fast, reliable, and secure air cargo services connecting your business to the world
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/airfreight.png"
                  alt="Air Freight Services"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-red-500">Why Choose Our Air Freight?</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
               As one of the leading independent airfreight company, we provide more flexibility, choice worldwide by working in partnership with an extensive range of specialist carriers who provide customized schedules and solutions. Our Directors and Managers are hands-on and work closely with our staff to provide an integrated highly professional service to our clients.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                The company through its extensive worldwide network have established a fast and efficient airfreight product which translates into a cost-efficient and fast movement of cargo to and from worldwide markets.
              </p>

              <p className="text-gray-700 text-lg leading-relaxed">
                OECL can provide customized sea-air & air-sea options to meet customer’s deadline/timeliness and achieve cost savings. The company handles the airfreight consolidation on many major routes through its efficient worldwide network
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-black mb-4">Our Service Benefits</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Speed & Efficiency",
                description: "Fastest transit times with priority handling for urgent shipments"
              },
              {
                icon: Globe,
                title: "Global Network",
                description: "Worldwide coverage with reliable airline partnerships"
              },
              {
                icon: Shield,
                title: "Secure & Insured",
                description: "Full cargo insurance and secure handling protocols"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 * index }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
              >
                <div className="bg-red-600/20 p-4 rounded-xl mb-6 w-fit">
                  <benefit.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AirFreight;
