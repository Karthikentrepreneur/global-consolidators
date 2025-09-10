import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
}

const FolderGallery = () => {
  const { country, folderName } = useParams<{ country?: string; folderName: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
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
    if (folderName) {
      fetchFolderImages();
    }
  }, [currentCountry, folderName]);

  const fetchFolderImages = async () => {
    setLoading(true);
    try {
      console.log('Fetching images for folder:', folderName, 'country:', currentCountry);
      
      const { data, error } = await supabase
        .from('gallery')
        .select('id, title, description, image_url, created_at')
        .eq('country', currentCountry)
        .eq('folder_name', folderName)
        .or('label.is.null,label.neq.private')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching folder images:', error);
        throw error;
      }

      console.log('Raw images data from Supabase:', data);
      console.log('Number of images found:', data?.length || 0);
      setImages(data || []);
    } catch (error: any) {
      console.error('Folder images fetch error:', error);
      toast({
        variant: "destructive",
        title: "Error loading folder images",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const goBackToGallery = () => {
    const countryPath = currentCountry === 'singapore' ? '' : `/${currentCountry}`;
    navigate(`${countryPath}/gallery`);
  };

  const getFolderDisplayName = () => {
    const folderDisplayNames: Record<string, string> = {
      'operations': 'Operations',
      'facilities': 'Facilities', 
      'community': 'Community'
    };
    return folderDisplayNames[folderName || ''] || folderName;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Button 
              variant="outline" 
              onClick={goBackToGallery}
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Button>
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl">{countryFlags[currentCountry]}</span>
              <h1 className="text-4xl font-bold text-gray-900">
                {getFolderDisplayName()} - {countryNames[currentCountry]}
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse images from the {getFolderDisplayName().toLowerCase()} folder in {countryNames[currentCountry]}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && images.length === 0 && (
            <div className="text-center py-16">
              <ImageIcon className="h-24 w-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Images in This Folder</h3>
              <p className="text-gray-600">
                Images for {getFolderDisplayName().toLowerCase()} in {countryNames[currentCountry]} will appear here once they're uploaded.
              </p>
            </div>
          )}

          {/* Images Grid */}
          {!loading && images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="aspect-square overflow-hidden">
                    <motion.img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        console.error('Image load error:', e);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {image.description}
                      </p>
                    )}
                    <div className="text-xs text-gray-400 mt-3">
                      {new Date(image.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl max-h-full w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold z-10"
            >
              ×
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h3 className="text-white text-xl font-semibold mb-2">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default FolderGallery;