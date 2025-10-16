import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Box, Package, Database, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
const Warehousing = () => {
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
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 mt-3 bg-blue-100 mt-9">
              <Box className="w-6 h-6 text-blue-500" />
              <span className="text-blue-500 font-semibold">Warehousing Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-blue-500">Warehousing</span>
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
                <img src="/warehousing.png" alt="Warehousing Services" className="w-full h-96 object-cover mx-auto" />
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
              <h2 className="text-3xl font-bold text-blue-500">Warehousing Solutions</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                GC possesses the necessary resources and expertise to effectively manage the warehousing of diverse commodities, including cold storage facilities.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Warehouse management plays a crucial role in the overall supply chain, focusing on controlling the movement and storage of materials within a warehouse. It encompasses various essential tasks such as shipping, receiving, put away, and picking, while also providing visibility into the processes preceding and following the supply chain link. By optimizing warehouse operations, your facility can become a catalyst for enhanced profitability and customer satisfaction, rather than an obstacle.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                The objective of warehouse management is to efficiently handle stock receipts and manage supplies, encompassing both supply chain management and demand management. It also encompasses container storage, loading, and unloading processes.
              </p>
            </motion.div>
          </div>

          {/* Additional Content Section */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
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
          }} className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                An effective warehouse management system provides a competitive advantage in retail chain distribution. GC strives to understand customer needs and assists in handling their requirements in the most optimal manner. We specialize in handling the vanning and devanning of consolidated cargo, ensuring timely distribution and delivery to the respective parties, thereby ensuring complete customer satisfaction.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                With our extensive network in domestic and global markets, GC can identify the ideal warehouse solution based on specific customer requirements, considering factors such as cost-effectiveness, storage specifications, commodity requirements, and proximity.
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
export default Warehousing;
