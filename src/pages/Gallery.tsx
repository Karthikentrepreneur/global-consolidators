import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  country: string;
  title: string;
  description: string | null;
  label: string | null;
  image_url: string;
  image_path: string;
  folder: string | null;       // NEW: preferred grouping source
  created_at: string;
}

const Gallery = () => {
  const { country } = useParams<{ country?: string }>();
  const location = useLocation();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { toast } = useToast();

  // --- Country helpers ---
  const getCurrentCountry = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/sri-lanka/")) return "srilanka";
    if (path.includes("/myanmar/")) return "myanmar";
    if (path.includes("/bangladesh/")) return "bangladesh";
    if (path.includes("/pakistan/")) return "pakistan";
    if (path.includes("/singapore/")) return "singapore";
    if (country) {
      const c = country.toLowerCase();
      if (c === "sri-lanka") return "srilanka";
      return c;
    }
    return "singapore";
  };

  const currentCountry = getCurrentCountry();

  const countryNames: Record<string, string> = {
    myanmar: "Myanmar",
    singapore: "Singapore",
    bangladesh: "Bangladesh",
    pakistan: "Pakistan",
    srilanka: "Sri Lanka",
  };

  const countryFlags: Record<string, string> = {
    myanmar: "🇲🇲",
    singapore: "🇸🇬",
    bangladesh: "🇧🇩",
    pakistan: "🇵🇰",
    srilanka: "🇱🇰",
  };

  // Fallback to parse folder from image_path if DB folder is null
  const deriveFolder = (img: GalleryImage) => {
    if (img.folder && img.folder.trim()) return img.folder.trim();
    if (img.image_path?.includes("/")) {
      const first = img.image_path.split("/")[0];
      return first || "Uncategorized";
    }
    return "Uncategorized";
  };

  const groupedImages = useMemo(() => {
    const groups: Record<string, GalleryImage[]> = {};
    images.forEach((img) => {
      const folder = deriveFolder(img);
      if (!groups[folder]) groups[folder] = [];
      groups[folder].push(img);
    });
    return groups;
  }, [images]);

  // --- Data fetch ---
  const fetchGalleryImages = useCallback(async () => {
    setLoading(true);
    try {
      // Only public: label is NULL OR label != 'private'
      const { data, error } = await supabase
        .from("gallery")
        .select(
          "id,country,title,description,label,image_url,image_path,folder,created_at"
        )
        .eq("country", currentCountry)
        .or("label.is.null,label.neq.private")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setImages((data as GalleryImage[]) || []);
    } catch (err: any) {
      console.error("Gallery fetch error:", err);
      toast({
        variant: "destructive",
        title: "Error loading gallery",
        description: err.message || "Failed to load images",
      });
    } finally {
      setLoading(false);
    }
  }, [currentCountry, toast]);

  useEffect(() => {
    fetchGalleryImages();
    // reset folder when country changes
    setSelectedFolder(null);
    setSelectedImage(null);
  }, [fetchGalleryImages]);

  // --- UI ---
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
              Explore our collection of images showcasing our operations and
              projects in {countryNames[currentCountry]}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Empty */}
          {!loading && images.length === 0 && (
            <div className="text-center py-16">
              <ImageIcon className="h-24 w-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Images Yet
              </h3>
              <p className="text-gray-600">
                Gallery images for {countryNames[currentCountry]} will appear
                here once they're uploaded.
              </p>
            </div>
          )}

          {/* Folders or images-in-folder */}
          {!loading && images.length > 0 && (
            <>
              {selectedFolder === null ? (
                // Folder grid (use button wrappers to avoid navigation)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Object.entries(groupedImages).map(
                    ([folder, folderImages], index) => (
                      <motion.div
                        key={folder}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.06 }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedFolder(folder)}
                          className="w-full bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer text-left"
                        >
                          <div className="aspect-square overflow-hidden">
                            <motion.img
                              src={folderImages[0].image_url}
                              alt={folder}
                              className="w-full h-full object-cover"
                              draggable={false}
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.3 }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                              {folder}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {folderImages.length} image
                              {folderImages.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </button>
                      </motion.div>
                    )
                  )}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedFolder(null)}
                    className="mb-6 text-blue-600 hover:underline"
                  >
                    ← Back to folders
                  </button>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {selectedFolder}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {groupedImages[selectedFolder]?.map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.06 }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={(e) => {
                          // Prevent any accidental navigation
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImage(image);
                        }}
                      >
                        <div className="aspect-square overflow-hidden">
                          <motion.img
                            src={image.image_url}
                            alt={image.title}
                            className="w-full h-full object-cover"
                            draggable={false}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => {
                              console.error("Image load error:", e);
                              (e.target as HTMLImageElement).style.display =
                                "none";
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
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal (no routing) */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl max-h-full w-full">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold z-10"
            >
              ×
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full h-full object-contain"
              draggable={false}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <h3 className="text-white text-xl font-semibold mb-2">
                {selectedImage.title}
              </h3>
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

export default Gallery;
