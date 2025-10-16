import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Ship, Container, Anchor } from "lucide-react";
import { Link } from "react-router-dom";
import CallToAction from "@/components/CallToAction";

const SeaFreight = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="min-h-screen bg-white">
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
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 mt-9 bg-blue-200">
              <Ship className="w-6 h-6 text-blue-500" />
              <span className="text-blue-500 font-semibold">SEA Freight</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              SEA <span className="text-blue-500">Freight</span>
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
                <img src="/oceanfreight.png" alt="SEA Freight" className="w-full h-96 object-cover mx-auto" />
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
              <h2 className="text-3xl font-bold text-blue-500">SEA Freight Services</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                At GC, we possess our own fleet of containers, which includes specialized equipment designed to cater to the unique requirements of our customers. With our extensive expertise in sea freight operations, we excel in various trade lanes. Our professionals ensure frequent departures and offer flexible service options. By partnering with multiple carriers on all trade routes, we secure favorable rates and guarantee space, allocation, timing, pricing, and shipment frequency.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                When it comes to container shipping, FCL (Full Container Load) is the most cost-effective and efficient option, considering the cargo's volume and weight. Throughout the entire process, we take meticulous care at every stage. This includes negotiating contract prices with carriers, reserving space, making bookings, retrieving empty containers from the depot, loading at the shipper's facility, transportation via truck or rail to the port, vessel loading, and closely monitoring the vessel schedule until the final delivery to the consignee.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                In the case of import bookings, we collaborate with our overseas partners in the absence of our own network. We diligently oversee each step of the process, keeping our customers and consignees well-informed at every stage.
              </p>
            </motion.div>
          </div>

          {/* LCL Services Section */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              x: -50
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.8
            }} viewport={{
              once: true
            }} className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Container className="w-8 h-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-blue-600">LCL Services</h3>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  GC offers its own consolidation service on numerous trade routes, leveraging an extensive network of consolidators. This enables the company to deliver competitive pricing and a range of sailing options. By regularly providing consolidation boxes to key trade lanes, GC can effectively handle cargo that requires timely deliveries. In addition, GC ensures complete transparency in pricing, including origin, destination, and sea freight charges.
                </p>
              </motion.div>
              
            </div>
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

      <CallToAction />
      
      <Footer />
    </div>;
};

export default SeaFreight;
