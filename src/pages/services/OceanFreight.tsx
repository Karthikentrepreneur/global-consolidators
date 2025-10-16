import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Ship } from "lucide-react";
const OceanFreight = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = ["Full Container Load (FCL)", "Less than Container Load (LCL)", "Door-to-door delivery", "Customs documentation", "Cargo tracking & monitoring", "Competitive freight rates"];
  return <div className="bg-white text-black min-h-screen">
      <Navigation />

      {/* Hero Section */}
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
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6 mt-3 bg-kargon-blue">
              <Ship className="w-6 h-6 text-white bg-transparent" />
              <span className="font-semibold text-slate-50">Ocean Freight Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Ocean Freight <span className="text-blue-500">Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Cost-effective sea cargo services for your bulk shipments with reliable scheduling
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                <img src="/oceanfreight.png" alt="Ocean Freight Services" className="w-full h-96 object-cover mx-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
              <h2 className="text-3xl font-bold text-blue-500">Comprehensive Ocean Freight</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
               At GC, we possess our own fleet of containers, which includes specialized equipment designed to cater to the unique requirements of our customers. With our extensive expertise in sea freight operations, we excel in various trade lanes. Our professionals ensure frequent departures and offer flexible service options. By partnering with multiple carriers on all trade routes, we secure favorable rates and guarantee space, allocation, timing, pricing, and shipment frequency
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Cards Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* FCL Card */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} viewport={{
          once: true
        }} className="p-6 md:p-8 rounded-2xl shadow-lg border-l-4 border-blue-500 bg-slate-200">
            <h3 className="text-xl md:text-2xl font-bold text-blue-500 mb-4 text-center">FCL Services</h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
              When it comes to container shipping, FCL (Full Container Load) is the most cost-effective and efficient option, considering the cargo's volume and weight. Throughout the entire process, we take meticulous care at every stage. This includes negotiating contract prices with carriers, reserving space, making bookings, retrieving empty containers from the depot, loading at the shipper's facility, transportation via truck or rail to the port, vessel loading, and closely monitoring the vessel schedule until the final delivery to the consignee.
            </p>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              In the case of import bookings, we collaborate with our overseas partners in the absence of our own network. We diligently oversee each step of the process, keeping our customers and consignees well-informed at every stage.
            </p>
          </motion.div>

          {/* LCL Card */}
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} viewport={{
          once: true
        }} className="p-6 md:p-8 rounded-2xl shadow-lg border-l-4 border-blue-500 bg-slate-200">
            <h3 className="text-xl md:text-2xl font-bold text-blue-500 mb-4 text-center">LCL Services</h3>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
             GC offers its own consolidation service on numerous trade routes, leveraging an extensive network of consolidators. This enables the company to deliver competitive pricing and a range of sailing options. By regularly providing consolidation boxes to key trade lanes, GC can effectively handle cargo that requires timely deliveries. In addition, GC ensures complete transparency in pricing, including origin, destination, and sea freight charges.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Transparency Message */}
      

      {/* Footer */}
      <Footer />
    </div>;
};
export default OceanFreight;