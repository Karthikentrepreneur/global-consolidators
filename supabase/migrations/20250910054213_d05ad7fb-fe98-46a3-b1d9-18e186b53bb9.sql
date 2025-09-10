-- Add folder support to gallery table
ALTER TABLE public.gallery 
ADD COLUMN folder_name TEXT;

-- Add index for better performance when querying by folder
CREATE INDEX idx_gallery_folder_country ON public.gallery(country, folder_name);

-- Create folders table to manage folder metadata
CREATE TABLE public.gallery_folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, country)
);

-- Enable RLS on folders table
ALTER TABLE public.gallery_folders ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to folders
CREATE POLICY "Gallery folders are publicly readable" 
ON public.gallery_folders 
FOR SELECT 
USING (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_gallery_folders_updated_at
BEFORE UPDATE ON public.gallery_folders
FOR EACH ROW
EXECUTE FUNCTION public.update_gallery_updated_at();

-- Insert some sample folders for different countries
INSERT INTO public.gallery_folders (name, display_name, description, country) VALUES
('operations', 'Operations', 'Our daily operations and logistics activities', 'srilanka'),
('facilities', 'Facilities', 'Our warehouses and office facilities', 'srilanka'),
('community', 'Community', 'Community outreach and CSR activities', 'srilanka'),
('operations', 'Operations', 'Our daily operations and logistics activities', 'singapore'),
('facilities', 'Facilities', 'Our warehouses and office facilities', 'singapore'),
('operations', 'Operations', 'Our daily operations and logistics activities', 'myanmar'),
('facilities', 'Facilities', 'Our warehouses and office facilities', 'myanmar'),
('operations', 'Operations', 'Our daily operations and logistics activities', 'bangladesh'),
('facilities', 'Facilities', 'Our warehouses and office facilities', 'bangladesh'),
('operations', 'Operations', 'Our daily operations and logistics activities', 'pakistan'),
('facilities', 'Facilities', 'Our warehouses and office facilities', 'pakistan');