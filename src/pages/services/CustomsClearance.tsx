import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { UserCheck, FileText, Shield, Globe, CheckCircle } from "lucide-react";
const CustomsClearance = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = ["Import/Export documentation", "Duty & tax calculation", "Compliance management", "Certificate handling", "Government liaison", "Fast clearance processing"];
  return <div className="bg-white text-black min-h-screen">
      <Navigation />
      
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
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
            <div className="inline-flex items-center gap-3 bg-red-600/20 px-6 py-3 rounded-full mb-6">
              <UserCheck className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">Customs Clearance</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Customs <span className="text-red-500">Clearance</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Expert customs brokerage services ensuring smooth and compliant cargo clearance
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
                <img src="/customclearance.png" alt="Customs Clearance Services" className="w-full h-96 object-cover mx-auto" />
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
              <h2 className="text-3xl font-bold text-red-500">Customs Clearance</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                As one of the leading custom clearing agents, we ensure that all clearance formalities are done in a smooth and easy manner so that all our customers receive their goods on time. Our customs brokers help ease import and export regulations and all paperwork related to trade compliances and procedures to ensure that your consignments via sea and air leave on time.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                OECL takes pride in being in business for more than a decade and have cleared all types of shipments of any sizes and for a plethora of goods from across the world taking care of each transportation with precision. It is our well-experienced team that makes us the best and leading customs clearing agents as our professionals carry out a complete study of all the local rules and regulations to help our clients overcome the complex matters of trade compliances.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                It is our ability in identifying demand and changing challenges in business that makes us the best to help you take care of all your paper works thereby ensuring the smooth flow of your business operations. With all the required documents in place, our professionals also ensure end-to-end solutions for both Import and Export Customs Clearance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
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
        }} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Why Choose Our Customs Service</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: FileText,
            title: "Expert Documentation",
            description: "Comprehensive handling of all import/export documentation requirements"
          }, {
            icon: Shield,
            title: "Compliance Assurance",
            description: "Ensuring full regulatory compliance across all jurisdictions"
          }, {
            icon: Globe,
            title: "Global Experience",
            description: "Extensive knowledge of international customs procedures and regulations"
          }].map((benefit, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2 * index
          }} viewport={{
            once: true
          }} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <div className="bg-red-600/20 p-4 rounded-xl mb-6 w-fit">
                  <benefit.icon className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default CustomsClearance;