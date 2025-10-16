import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Box } from "lucide-react";
import { Link } from "react-router-dom";
const ThirdPartyLogistics = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="bg-white text-black min-h-screen">
      <Navigation />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-blue-600/20 px-6 py-3 rounded-full mb-6 mt-9">
              <Box className="w-6 h-6 text-blue-500" />
              <span className="text-blue-500 font-semibold">3PL Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-blue-500">3PL</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src="/3pl.png" alt="3PL" className="w-full h-96 object-cover mx-auto" />
              </div>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.4
          }} className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-500">3PL</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                With our cutting-edge 3PL warehouse management system, you can optimize your business operations and implement advanced fulfillment strategies for enhanced customer satisfaction, while simultaneously minimizing expenses and delivery durations.
              </p>
            </motion.div>
          </div>

          {/* CTA Section */}
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
        }} className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white p-12 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">Get a quick consultation and our experts are here to help you out</h3>
            <Link to="/contact">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                Reach Us
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default ThirdPartyLogistics;