import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  image_path: string;
  created_at: string;
  folder: string | null; // 👈 NEW
  country?: string;      // (not strictly required here, but handy)
}

const Gallery = () => {
  const { country, "*": splat } = useParams<{ country?: string; "*": string }>();
  // splat captures the trailing path (e.g., "f/Events")
  const location = useLocation();
  const navigate = useNavigate();

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const { toast } = useToast();

  // URL helpers
  const parseFolderFromUrl = useCallback(() => {
    // We support routes like:
    // /gallery/:country/f/:folder
    // /gallery/f/:folder (no country)
    // Decode folder slug back to name
    // Example splat = "f/Events" or "f/My%20Album"
    if (!splat) return null;
    const parts = splat.split("/").filter(Boolean);
    if (parts[0] === "f" && parts[1]) {
      try {
        return decodeURIComponent(parts[1]);
      } catch {
        return parts[1];
      }
    }
    return null;
  }, [splat]);

  // Extract current country from path or param
  const getCurrentCountry = () => {
    const path = location.pathname.toLowerCase();

    if (path.includes("/sri-lanka/")) return "srilanka";
    if (path.includes("/myanmar/")) return "myanmar";
    if (path.includes("/bangladesh/")) return "bangladesh";
    if (path.includes("/pakistan/")) return "pakistan";
    if (path.includes("/singapore/")) return "singapore";

    if (country) {
      const cl = country.toLowerCase();
      if (cl === "sri-lanka") return "srilanka";
      return cl;
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

  // Group by folder (prefer `folder` column; fallback to image_path prefix)
  const groupedImages = useMemo(() => {
    const groups: Record<string, GalleryImage[]> = {};
    images.forEach((img) => {
      const byFolder = img.folder?.trim();
      let key: string;
      if (byFolder) {
        key = byFolder;
      } else if (img.image_path?.includes("/")) {
        key = img.image_path.split("/")[0] || "Uncategorized";
      } else {
        key = "Uncategorized";
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(img);
    });
    return groups;
  }, [images]);

  const fetchGalleryImages = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("id, title, description, image_url, image_path, created_at, folder")
        .eq("country", currentCountry)
        .or("label.is.null,label.neq.private")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error loading gallery",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [currentCountry, toast]);

  // Sync selected folder from URL
  useEffect(() => {
    setSelectedFolder(parseFolderFromUrl());
  }, [parseFolderFromUrl]);

  useEffect(() => {
    fetchGalleryImages();
  }, [fetchGalleryImages]);

  // Handlers for folder navigation
  const openFolder = (folderName: string) => {
    setSelectedFolder(folderName);
    const encoded = encodeURIComponent(folderName);
    // Build path preserving country segment if present
    const base =
      currentCountry ? `/gallery/${currentCountry}` : "/gallery";
    navigate(`${base}/f/${encoded}`, { replace: false });
  };

  const backToFolders = () => {
    setSelectedFolder(null);
    const base =
      currentCountry ? `/gallery/${currentCountry}` : "/gallery";
    navigate(base, { replace: false });
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
                Gallery — {countryNames[currentCountry]}
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore images from our operations and projects in{" "}
              {countryNames[currentCountry]} by folders.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          )}

          {/* Empty */}
          {!loading && images.length === 0 && (
            <div className="text-center py-16">
              <ImageIcon className="h-24 w-24 mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Images Yet</h3>
              <p className="text-gray-600">
                Upload images to see them here. You can group them using the optional
                <span className="font-medium"> folder</span> field.
              </p>
            </div>
          )}

          {/* Folders grid OR selected folder grid */}
          {!loading && images.length > 0 && (
            selectedFolder === null ? (
              // Folder list
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(groupedImages).map(([folder, folderImages], index) => (
                  <motion.div
                    key={folder}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => openFolder(folder)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <motion.img
                        src={folderImages[0]?.image_url}
                        alt={folder}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {folder}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {folderImages.length} image{folderImages.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Images inside selected folder
              <>
                <button
                  onClick={backToFolders}
                  className="mb-6 text-blue-600 hover:underline"
                >
                  ← Back to folders
                </button>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedFolder}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(groupedImages[selectedFolder] || []).map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.06 }}
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
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
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
            )
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="max-w-4xl max-h-full w-full relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold z-10"
              aria-label="Close"
            >
              ×
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full h-full object-contain"
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
