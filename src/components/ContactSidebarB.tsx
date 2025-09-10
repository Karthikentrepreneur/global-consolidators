import React, { useRef, useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { X, MapPin, Globe, ExternalLink, Phone, Mail, Home, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from '@/hooks/use-mobile';

interface ContactSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface City {
  name: string;
  lat: number;
  lng: number;
  address: string;
  contacts: string[];
  email?: string;
}

interface Country {
  code: string;
  name: string;
  lat: number;
  lng: number;
  cities: City[];
}

const countries: Country[] = [{
code: "in",
  name: "India",
  lat: 9.9323,
  lng: 76.2996,
  cities: [{
    name: "Kerala",
    lat: 9.9323,
    lng: 76.2996,
    address: "CC 59/801A Elizabeth Memorial Building, Thevara Ferry Jn, Cochin 682013 , Kerala.",
    contacts: ["+91 484 4019192 / 93"]
  },{
    name: "Mumbai",
    lat: 19.01123,
    lng: 73.03715,
    address: "803 / 804, Shelton Cubix, Plot No. 87, Sector-15,CBD Belapur, Navi Mumbai, Maharastra - 400614.",
    contacts: ["022-35131688 / 35113475 / 35082586"]
  }, {
    name: "Mumbai-Andheri",
    lat: 19.11303, 
    lng: 72.86848,
    address: "503, Midas, Sahar Plaza Complex,Sir M.V Road,Andheri East, Mumbai 400059",
    contacts: ["+91 8879756838"]
  },{
    name: "Delhi",
    lat: 28.62748,
    lng: 77.2221,
    address: "903, Surya Kiran Building K.G Marg,Connaught Place New Delhi - 110001",
    contacts: ["+91 11 493224477 / 48 /49"]
  }, {
    name: "Bangalore",
    lat: 13.01855,
    lng: 77.64191,
    address: "3C-964 IIIrd Cross Street,HRBR LAYOUT 1st Block,Kalayan Nagar Bannaswadi,Bengaluru - 560043.",
    contacts: ["+91 9841676259"]
  }, {
    name: "Kolkata",
    lat: 22.5769, 
    lng: 88.4341,
    address: "Merlin Matrix, 3rd floor, Room No. 303 10,D. N. BLOCK, SECTOR - V SALT LAKE CITY, Kolkata – 700091",
    contacts: ["+91 33 46025458 / 59 / 60/ 61"]
  }]
}, {
  code: "lk",
  name: "Sri Lanka",
  lat: 6.9271,
  lng: 79.8612,
  cities: [{
    name: "Colombo",
    lat: 6.9271,
    lng: 79.8612,
    address: "Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01, Sri Lanka",
    contacts: ["+94 114477499", "+94 114477494 / 98"],
    email: "thilanka.cmb@globalconsol.com"
  }]
},{
  code: "us",
  name: "United States (USA)",
  lat: 41.8622,
  lng: -87.7209,
  cities: [{
    name: "Chicago",
    lat: 41.8622,
    lng: -87.7209,
    address: "939 W. North Avenue, Suite 750, Chicago, IL 60642",
    contacts: ["+1 847 254 7320"],
    email: "info@gglusa.us"
  }, {
    name: "New York",
    lat: 37.4545,
    lng: -122.1818,
    address: "New Jersey Branch, 33 Wood Avenue South Suite 600, Iselin, NJ 08830",
    contacts: ["+1 732 456 6780"],
    email: "info@gglusa.us"
  }, {
    name: "Los Angeles",
    lat: 40.5330,
    lng: -74.3481,
    address: "2250 South Central Avenue Compton, CA 90220",
    contacts: ["+1 310 928 3903"],
    email: "info@gglusa.us"
  }]
}, {
  code: "ae",
  name: "United Arab Emirates (UAE)",
    lat: 25.2048,
    lng: 55.2708,
  cities: [{
    name: "Dubai",
    lat: 25.2048,
    lng: 55.2708,
    address: "Office # 509, Al Nazar Plaza, Oud Metha, Dubai, U.A.E",
    contacts: ["+971 4 3433388"]
  }, {
    name: "JEBEL ALI",
    lat: 24.9857,
    lng: 55.1436,
    address: "Warehouse# Zg06, Near Roundabout 13, North Zone, p. B No: 30821, jebel Ali, Dubai, U.A.E",
    contacts: ["+971 4 8819787"]
  }, {
    name: "ABU DHABI",
    lat: 24.4539,
    lng: 54.3773,
    address: "PB No: 30500, Office 3-1, Unit 101, 1st Floor, Al Jaber Jewellery Building, Al Khalidiya, Abu Dhabi, U.A.E",
    contacts: ["+971 50 4337214"]
  }]
}, {
  code: "qa",
  name: "Qatar",
    lat: 25.276987,
    lng: 51.520008,
  cities: [{
    name: "Doha",
    lat: 25.276987,
    lng: 51.520008,
    address: "Office no: 48, 2nd Floor, Al matar Centre, Old Airport Road Doha",
    contacts: ["0974 33622555"]
  }]
},{
  code: "cn",
  name: "China",
    lat: 22.54262,
    lng: 114.11696,
  cities: [{
    name: "China",
    lat: 22.54262,
    lng: 114.11696,
    address: "13C02, Block A, Zhaoxin Huijin Plaza 3085 Shennan East Road, Luohu, Shenzhen.",
    contacts: ["+86 75582222447"],
    email: "helen@haixun.co"
  }]
}, {
  code: "sa",
  name: "Saudi Arabia",
  lat: 26.4207,
    lng: 50.0888,
  cities: [{
    name: "Dammam",
    lat: 26.4207,
    lng: 50.0888,
    address: "Building No.2817, Secondary No9403, King Faisal Road, Al Tubebayshi Dist, Dammam, KSA 32233",
    contacts: ["+966 13 343 0003"]
  }, {
    name: "Riyadh",
    lat: 24.7136,
    lng: 46.6753,
    address: "Room No. T18, Rail Business Centre, Bldg No. 3823, Omar Aimukhtar St, Thulaim, Riyadh 11332",
    contacts: ["+966 11295 0020"]
  }, {
    name: "Jeddah",
    lat: 21.4858,
    lng: 39.1925,
    address: "Al-Madinah Al-Munawarah Road, Al Sharafeyah, Jeddah 4542 -22234, Kingdom of Saudi Arabia",
    contacts: ["+966 12 578 0874"]
  }]
},{
  code: "sg",
  name: "Singapore",
  lat: 1.3521,
  lng: 103.8198,
  cities: [{
    name: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
    address: "Blk 511 Kampong Bahru Road, #03-01 Keppel Distripark, Singapore - 099447",
    contacts: ["+ 65 69080838"],
    email: "buddhika@globalconsol.com"
  }]
}, {
  code: "mm",
  name: "Myanmar",
  lat: 16.8409,
  lng: 96.1735,
  cities: [{
    name: "Yangon",
    lat: 16.8409,
    lng: 96.1735,
    address: "No.608, Room 8B, Bo Soon Pat Tower, Merchant Street, Pabedan Township, Yangon, Myanmar",
    contacts: ["+951 243158", "+951 377985, 243101"],
    email: "info@globalconsol.com"
  }]
}, {
  code: "pk",
  name: "Pakistan",
  lat: 24.8608,
  lng: 67.0097,
  cities: [{
    name: "Karachi",
    lat: 24.8608,
    lng: 67.0097,
    address: "Suite No.301, 3rd Floor, Fortune Center, Shahrah-e-Faisal, Block 6, PECHS, Karachi, Pakistan",
    contacts: ["+92-300-8282511", "+92-21-34302281-5"],
    email: "khalid.pk@globalconsol.com"
  }, {
    name: "Lahore",
    lat: 31.5204,
    lng: 74.3487,
    address: "Office # 301, 3rd Floor, Gulberg Arcade Main Market, Gulberg 2, Lahore, Pakistan",
    contacts: ["+92 42-35782306/07/08"],
    email: "shazia.pklhe@globalconsol.com"
  }]
}, {
  code: "gb",
  name: "United Kingdom (UK)",
  lat: 51.5074,
  lng: -0.1278,
  cities: [{
    name: "London",
    lat: 51.5074,
    lng: -0.1278,
    address: "167-169 Great Portland Street 5th Floor, London W1W 5PF, United Kingdom",
    contacts: ["+44 (0) 203 393 9508"]
  }]
}, {
  code: "au",
  name: "Australia",
  lat: -37.7064,
  lng: 144.8503,
  cities: [{
    name: "Melbourne",
    lat: -37.7064,
    lng: 144.8503,
    address: "Suite 5, 7-9 Mallet Road, Tullamarine, Victoria, 3043",
    contacts: ["Mob: +61 432254969", "Tel: +61 388205157"],
    email: "info@gglaustralia.com"
  }]
}];

// Sort countries alphabetically by name
const sortedCountries: Country[] = [...countries].sort((a, b) => a.name.localeCompare(b.name));

const ContactSidebarB: React.FC<ContactSidebarProps> = ({ isOpen, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<City | null>(null);
  const [selectedCityIndexes, setSelectedCityIndexes] = useState<{ [countryName: string]: number }>({});
  const isMobile = useIsMobile();

  useEffect(() => {
    iframeRef.current = document.querySelector('iframe');
  }, []);

  // Set default selected location to the first city of the first country
  useEffect(() => {
    if (sortedCountries.length > 0 && sortedCountries[0].cities.length > 0) {
      const firstCountry = sortedCountries[0];
      const firstCity = firstCountry.cities[0];
      setSelectedLocation(firstCity);
      setExpandedCountry(firstCountry.name);
      
      // Initialize selected city indexes for all countries to 0 (first city)
      const initialIndexes: { [countryName: string]: number } = {};
      sortedCountries.forEach(country => {
        initialIndexes[country.name] = 0;
      });
      setSelectedCityIndexes(initialIndexes);
      
      // Navigate to the first location on map
      navigateToLocation(firstCity.lat, firstCity.lng, firstCity);
    }
  }, []);

  const navigateToLocation = (lat: number, lng: number, city: City | null = null) => {
    // Find the iframe in the ContactMapContainer
    const iframe = document.querySelector('iframe[title="Interactive Map"]') as HTMLIFrameElement;
    if (iframe) {
      try {
        // Use higher zoom level for city-specific locations
        const zoomLevel = city ? 12 : 9;
        const baseUrl = "https://www.google.com/maps/d/u/0/embed?mid=1Gy9JUvlSaOBrtQaKI7OoYU2KgFymoXg&ehbc";
        const newSrc = `${baseUrl}&z=${zoomLevel}&ll=${lat},${lng}&hl=en&ehbc=2E312F&output=embed`;
        iframe.src = newSrc;
        if (city) {
          setSelectedLocation(city);
        }
      } catch (e) {
        console.error("Navigation failed:", e);
      }
    }
  };

  const handleCitySelection = (country: Country, cityIndex: number) => {
    setSelectedCityIndexes(prev => ({
      ...prev,
      [country.name]: cityIndex
    }));
    
    const selectedCity = country.cities[cityIndex];
    navigateToLocation(selectedCity.lat, selectedCity.lng, selectedCity);
  };

  const isSelectedCity = (countryName: string, cityIndex: number) => {
    return selectedCityIndexes[countryName] === cityIndex;
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar container */}
      <div className={`my-3 w-full ${isMobile ? 'max-w-[95%]' : 'max-w-[520px]'} mx-auto px-2 md:px-0`}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-xl shadow-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <h2 className="font-bold text-lg">Global Locations</h2>
          </div>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-red-500/20">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Content area */}
        <ScrollArea className={`h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] bg-white rounded-b-xl shadow-md`}>
          <div className="p-4">
            <div className="mt-4 space-y-3">
              <Accordion type="single" collapsible value={expandedCountry || ""} className="w-full space-y-3">
                {sortedCountries.map(country => {
                  return (
                    <AccordionItem 
                      key={country.name} 
                      value={country.name} 
                      className="border border-red-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-white"
                    >
                      <AccordionTrigger 
                        onClick={() => {
                          setExpandedCountry(expandedCountry === country.name ? null : country.name);
                          navigateToLocation(country.lat, country.lng);
                        }}
                        className="rounded-t-md hover:bg-amber-50 transition-colors px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={`/${country.code}.svg`} 
                            alt={`${country.name} flag`} 
                            className="w-6 h-6 rounded-sm object-cover shadow-sm" 
                          />
                          <span className="font-medium">{country.name}</span>
                        </div>
                      </AccordionTrigger>
                      
                      <AccordionContent className="bg-gradient-to-b from-red-50/30 to-white px-3 py-2">
                        <div className="space-y-2">
                          {/* All cities displayed as buttons */}
                          <div className="space-y-2">
                            {country.cities.map((city: City, index: number) => (
                              <div key={index} className="w-full">
                                <Button 
                                  variant="ghost" 
                                  className={cn(
                                    "w-full justify-start text-sm p-2 h-auto rounded-md border transition-all shadow-sm",
                                    isSelectedCity(country.name, index) 
                                      ? "bg-red-100 hover:bg-red-150 border-red-300 text-red-800" 
                                      : "bg-white hover:bg-red-50 border-gray-100 hover:border-red-200"
                                  )}
                                  onClick={() => {
                                    handleCitySelection(country, index);
                                    if (isMobile) {
                                      setTimeout(() => setSelectedLocation({ ...city }), 50);
                                    }
                                  }}
                                >
                                  <MapPin className="w-4 h-4 mr-2 text-red-600 flex-shrink-0" />
                                  <span className="font-medium truncate">{city.name}</span>
                                  <ChevronRight className="w-4 h-4 ml-auto text-red-300" />
                                </Button>
                                
                                {/* Show address details for selected city */}
                                {isSelectedCity(country.name, index) && city.address && (
                                  <div className="mt-2 p-3 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-200 shadow text-sm animate-in fade-in duration-300 w-full">
                                    <h4 className="font-semibold text-red-700 mb-2 pb-1 border-b border-red-100 flex items-center">
                                      <span className="bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">{city.name} Office</span>
                                    </h4>
                                    
                                    <div className="flex items-start mb-2 group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                                      <Home className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                                      <p className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm break-words w-full overflow-hidden">{city.address}</p>
                                    </div>
                                    
                                    {city.contacts && city.contacts.length > 0 && (
                                      <div className="flex items-start mb-2 group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                                        <Phone className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                                        <div className="space-y-1 w-full overflow-hidden">
                                          {city.contacts.map((contact: string, idx: number) => (
                                            <p key={idx} className="text-gray-700 group-hover:text-gray-900 transition-colors text-sm break-words">{contact}</p>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {city.email && (
                                      <div className="flex items-start group hover:bg-red-50/50 p-2 rounded-md transition-colors w-full">
                                        <Mail className="w-4 h-4 mr-2 text-red-500 mt-1 flex-shrink-0 group-hover:text-red-600 transition-colors" />
                                        <a 
                                          href={`mailto:${city.email}`} 
                                          className="text-red-600 hover:text-red-800 hover:underline flex items-center text-sm break-words w-full overflow-hidden"
                                        >
                                          {city.email}
                                          <ExternalLink className="ml-1 h-3 w-3" />
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ContactSidebarB;
