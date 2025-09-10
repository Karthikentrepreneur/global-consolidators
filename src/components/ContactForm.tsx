import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Building2, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";

// Brand Colors
const BRAND = {
  gold: "#c0a064",
  blue: "#2172c9",
  black: "#111"
};
const allOffices = {
  Singapore: [{
    name: "Headquarters",
    address: "Blk 511 Kampong Bahru Road, #03-01 Keppel Distripark, Singapore 099447",
    phones: ["+65 69080838", "+65 96272211"],
    emails: ["buddhika@globalconsol.com"]
  }],
  "Sri Lanka": [{
    name: "Colombo",
    address: "Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka",
    phones: ["+94 114477494", "+94 114477498", "+94 114477499", "+94 764434885"],
    emails: ["thilanka.cmb@globalconsol.com"]
  }],
  Pakistan: [{
    name: "Karachi",
    address: "Suite No.301, 3rd Floor, Fortune Center, Shahrah-e-Faisal, Block 6, PECHS, Karachi, Pakistan.",
    phones: ["+92-300-8282511", "+92-21-34302281-5"],
    emails: ["khalid.pk@globalconsol.com"]
  }, {
    name: "Lahore",
    address: "Office # 301, 3rd Floor, Gulberg Arcade Main Market, Gulberg 2, Lahore, Pakistan.",
    phones: ["+92 42-35782306", "+92 42-35782307", "+92 42-35782308"],
    emails: ["shazia.pklhe@globalconsol.com"]
  }],
  Myanmar: [{
    name: "Yangon",
    address: "#1210, 12TH (A) FLOOR, SAKURA TOWER 339, BOGYOKE SAN ROAD, KYAUKTADA TOWNSHIP - 11181 YANGON, UNION OF MYANMAR",
    phones: ["951 243158", "951 243101"],
    emails: ["info@globalconsol.com"]
  }],
  Bangladesh: [{
    name: "Dhaka",
    address: "ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord, No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh",
    phones: ["+880 1716 620989"],
    emails: ["info@globalconsol.com"]
  }]
};
const locationOptions = Object.keys(allOffices);
const ContactForm = () => {
  const location = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(locationOptions[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);
  const getCurrentCountry = useCallback(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/singapore")) return "Singapore";
    if (path.includes("/sri-lanka")) return "Sri Lanka";
    if (path.includes("/myanmar")) return "Myanmar";
    if (path.includes("/bangladesh")) return "Bangladesh";
    if (path.includes("/pakistan")) return "Pakistan";
    return "Singapore";
  }, [location.pathname]);
  useEffect(() => {
    setSelectedLocation(getCurrentCountry());
  }, [getCurrentCountry]);
  const currentOffices = allOffices[selectedLocation] || [];
  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const emails = ["karthikjungleemara@gmail", "karthiktrendsandtactics@gmail.com"];
    try {
      for (const email of emails) {
        await fetch(`https://formsubmit.co/ajax/${email}`, {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: formData
        });
      }
      form.reset();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };
  return <section id="contact" className="py-16 bg-slate-200">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }} viewport={{
        once: true
      }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{
          color: BRAND.blue
        }}>Get In Touch</h2>
          <div className="w-24 h-1 mx-auto mb-4" style={{
          background: BRAND.gold
        }} />
          <p className="max-w-2xl mx-auto text-lg" style={{
          color: BRAND.black
        }}>
            Ready to streamline your logistics? Contact us today for a customized solution.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Office List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{
            color: BRAND.blue
          }}>
              <Building2 className="w-6 h-6" style={{
              color: BRAND.gold
            }} /> Our Offices
            </h3>
            {(currentOffices.length > 0 ? currentOffices : []).map((office, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.4 + idx * 0.1
          }} viewport={{
            once: true
          }} className="p-6 rounded-xl shadow-lg" style={{
            border: `2px solid ${BRAND.gold}`,
            background: "#fff"
          }}>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{
              color: BRAND.blue
            }}>
                  <span className="w-3 h-3 rounded-full" style={{
                background: BRAND.gold
              }} />
                  {office.name}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5" style={{
                  color: BRAND.gold
                }} />
                    <p className="text-sm" style={{
                  color: BRAND.black
                }}>
                      {office.address}
                    </p>
                  </div>
                  {office.phones && office.phones.map((phone, i) => <div key={i} className="flex items-center gap-3">
                        <Phone className="w-5 h-5" style={{
                  color: BRAND.gold
                }} />
                        <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="text-sm hover:underline" style={{
                  color: BRAND.black
                }}>
                          {phone}
                        </a>
                      </div>)}
                  {office.emails && office.emails.map((email, i) => <div key={i} className="flex items-center gap-3">
                        <Mail className="w-5 h-5" style={{
                  color: BRAND.gold
                }} />
                        <a href={`mailto:${email}`} className="text-sm hover:underline" style={{
                  color: BRAND.black
                }}>
                          {email}
                        </a>
                      </div>)}
                </div>
              </motion.div>)}
          </div>

          {/* Form */}
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }} viewport={{
          once: true
        }} className="p-8 rounded-2xl shadow-xl border" style={{
          borderColor: BRAND.gold,
          background: "#fff" // pure white
        }}>
            <h3 className="text-2xl font-bold mb-6" style={{
            color: BRAND.blue
          }}>
              Send us a Message
            </h3>
            <p className="mb-6" style={{
            color: BRAND.black
          }}>
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="box" />
              <input type="hidden" name="_subject" value={`New Contact Submission from ${selectedLocation}`} />
              <input type="hidden" name="Preferred_Location" value={selectedLocation} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{
                  color: BRAND.black
                }}>First Name *</label>
                  <Input placeholder="Enter your first name" name="First Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{
                  color: BRAND.black
                }}>Last Name *</label>
                  <Input placeholder="Enter your last name" name="Last Name" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{
                  color: BRAND.black
                }}>Email Address *</label>
                  <Input type="email" name="Email" placeholder="Enter your email" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" style={{
                  color: BRAND.black
                }}>Phone Number</label>
                  <Input name="Phone" placeholder="Enter your phone number" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{
                color: BRAND.black
              }}>Company/Organization</label>
                <Input name="Organization" placeholder="Enter your company name" />
              </div>

              <div className="space-y-2 max-w-md mx-auto p-4 rounded-lg shadow" style={{
              background: "#fff"
            }}>
                <label className="text-sm font-medium" style={{
                color: BRAND.black
              }}>Preferred Office Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select office location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{
                color: BRAND.black
              }}>Message *</label>
                <Textarea name="Message" placeholder="Tell us about your logistics needs..." required rows={5} />
              </div>

              <motion.div whileHover={{
              scale: 1.02
            }} whileTap={{
              scale: 0.98
            }}>
                <Button type="submit" style={{
                width: "100%",
                background: BRAND.blue,
                color: "#fff",
                padding: "1.5rem 0",
                fontSize: "1.125rem",
                fontWeight: 600,
                borderRadius: "1rem",
                border: `2px solid ${BRAND.gold}`
              }}>
                  <Send className="w-5 h-5 mr-2" style={{
                  color: BRAND.gold
                }} />
                  Send Message
                </Button>
              </motion.div>

              {showSuccess && <motion.div initial={{
              opacity: 0,
              y: -10
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -10
            }} className="mt-6 p-4 rounded-xl shadow flex items-center gap-3" style={{
              background: "#fff",
              border: `1px solid ${BRAND.gold}`,
              color: BRAND.black
            }}>
                  <CheckCircle2 className="w-5 h-5" style={{
                color: BRAND.blue
              }} />
                  <p className="text-sm md:text-base font-medium">
                    Your message has been sent successfully. We'll get back to you soon!
                  </p>
                </motion.div>}
            </form>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default ContactForm;
