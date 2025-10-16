import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Container, Network, Anchor, Calendar, CheckCircle } from "lucide-react";
const LinearAgency = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const features = ["Shipping line representation", "Vessel booking management", "Container tracking", "Port operations support", "Documentation handling", "Customer service liaison"];
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
              <Container className="w-6 h-6 text-red-500" />
              <span className="text-red-500 font-semibold">Linear Agency Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Linear Agency <span className="text-red-500">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional shipping line representation and comprehensive port agency services
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
                <img src="/linearagency.png" alt="Linear Agency Services" className="w-full h-96 object-cover mx-auto" />
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
              <h2 className="text-3xl font-bold text-red-500">Linear Agency</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                OECL has liner division which is representing many medium to small carriers who use our local knowledge and expertise to handle and market their products.We provide first class liner and port agency services, together with an extensive range of related services to liners who trust our company knowing the potential and people in the management and their experience.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Highly dedicated, enthusiastic and professional employees, providing top quality service, have swiftly turned Overseas Express Container Lines into a well-established agency, with a remarkable reputation in all aspects.With dedicated trained personnel for each principals OECL ensures equal attention and care in order to protect every principal's interest.
              </p>
              
              <p className="text-gray-700 text-lg leading-relaxed">
                With shipping industry going through many changes, OECL helps shipping carriers to optimize their resources by providing local support to ensure a win-win formula. We provide full range of general agency to various elements of shipping support and our services are tailored to meet the exact needs of principals in this fast changing global liner shipping environment.
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
            <h2 className="text-4xl font-bold text-black mb-4">Our Agency Services</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: Network,
            title: "Line Representation",
            description: "Professional representation of major shipping lines in regional ports"
          }, {
            icon: Anchor,
            title: "Port Operations",
            description: "Complete port agency services including vessel clearance and support"
          }, {
            icon: Calendar,
            title: "Schedule Management",
            description: "Efficient vessel scheduling and booking coordination services"
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
export default LinearAgency;