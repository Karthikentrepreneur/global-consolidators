
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, FolderOpen } from "lucide-react";

interface GalleryFolder {
  id: string;
  name: string;
  display_name: string;
  description: string | null;
  cover_image_url: string | null;
  country: string;
}

const Gallery = () => {
  const { country } = useParams<{ country: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Extract country from URL path
  const getCurrentCountry = () => {
    const path = location.pathname.toLowerCase();
    
    // Check for country-specific routes in the path
    if (path.includes('/sri-lanka/')) return 'srilanka';
    if (path.includes('/myanmar/')) return 'myanmar';
    if (path.includes('/bangladesh/')) return 'bangladesh';
    if (path.includes('/pakistan/')) return 'pakistan';
    if (path.includes('/singapore/')) return 'singapore';
    
    // Check URL params
    if (country) {
      const countryLower = country.toLowerCase();
      if (countryLower === 'sri-lanka') return 'srilanka';
      return countryLower;
    }
    
    // If it's just /gallery (no country prefix), default to singapore
    return 'singapore';
  };

  const currentCountry = getCurrentCountry();

  const countryNames: Record<string, string> = {
    myanmar: "Myanmar",
    singapore: "Singapore",
    bangladesh: "Bangladesh",
    pakistan: "Pakistan",
    srilanka: "Sri Lanka"
  };

  const countryFlags: Record<string, string> = {
    myanmar: "🇲🇲",
    singapore: "🇸🇬",
    bangladesh: "🇧🇩",
    pakistan: "🇵🇰",
    srilanka: "🇱🇰"
  };

  useEffect(() => {
    fetchGalleryFolders();
  }, [currentCountry]);

  const fetchGalleryFolders = async () => {
    setLoading(true);
    try {
      console.log('Fetching folders for country:', currentCountry);
      
      const { data, error } = await supabase
        .from('gallery_folders')
        .select('*')
        .eq('country', currentCountry)
        .order('display_name');

      if (error) {
        console.error('Error fetching gallery folders:', error);
        throw error;
      }

      console.log('Raw folders from Supabase:', data);
      console.log('Number of folders found:', data?.length || 0);
      setFolders(data || []);
    } catch (error: any) {
      console.error('Gallery fetch error:', error);
      toast({
        variant: "destructive",
        title: "Error loading gallery folders",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderName: string) => {
    const currentPath = location.pathname;
    const basePath = currentPath.replace('/gallery', '');
    navigate(`${basePath}/gallery/${folderName}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{countryFlags[currentCountry]}</span>
              <h1 className="text-4xl font-bold text-gray-900">
                Gallery - {countryNames[currentCountry]}
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our collection of images showcasing our operations and projects in {countryNames[currentCountry]}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && folders.length === 0 && (
            <div className="text-center py-16">
              <FolderOpen className="h-24 w-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Folders Yet</h3>
              <p className="text-gray-600">
                Gallery folders for {countryNames[currentCountry]} will appear here once they're created.
              </p>
            </div>
          )}

          {/* Folders Grid */}
          {!loading && folders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {folders.map((folder, index) => (
                <motion.div
                  key={folder.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => handleFolderClick(folder.name)}
                >
                  <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    {folder.cover_image_url ? (
                      <motion.img
                        src={folder.cover_image_url}
                        alt={folder.display_name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <FolderOpen className="h-16 w-16 text-blue-400 group-hover:text-blue-500 transition-colors" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {folder.display_name}
                      </h3>
                    </div>
                    {folder.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {folder.description}
                      </p>
                    )}
                    <div className="mt-4 text-blue-600 text-sm font-medium group-hover:underline">
                      View Images →
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Gallery;
