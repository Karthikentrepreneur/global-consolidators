import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Trash2, Upload, FileText, Edit, X, Bold, Link, Italic, Underline, List, Image } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featured_image?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  alt_text?: string;
  tags?: string[];
}

interface GalleryImage {
  id: string;
  country: string;
  title: string;
  description: string | null;
  label: string | null;
  image_url: string;
  image_path: string;
  created_at: string;
  updated_at: string;
}

type ActiveView = "blog" | "gallery";

const countries = [
  { value: "myanmar", label: "Myanmar" },
  { value: "singapore", label: "Singapore" },
  { value: "bangladesh", label: "Bangladesh" },
  { value: "pakistan", label: "Pakistan" },
  { value: "srilanka", label: "Sri Lanka" },
];

const BlogEditor = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>("blog");
  const { toast } = useToast();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Blog form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [altText, setAltText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Gallery state
  const [selectedCountry, setSelectedCountry] = useState("singapore");
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  // Gallery upload form state
  const [galleryUploadForm, setGalleryUploadForm] = useState({
    title: "",
    description: "",
    country: "singapore",
    label: "",
    folder: "",
    file: null as File | null,
  });

  // Gallery edit form state
  const [galleryEditForm, setGalleryEditForm] = useState({
    title: "",
    description: "",
    label: "",
  });

  // Link dialog state
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const adminStatus = localStorage.getItem("isAdminLoggedIn");
    if (adminStatus === "true") {
      setIsLoggedIn(true);
      fetchArticles();
    } else {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    if (activeView === "gallery" && isLoggedIn) {
      fetchGalleryImages();
    }
  }, [activeView, selectedCountry, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin-login");
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      console.log('Fetching articles...');
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      console.log('Articles fetched:', data);
      setArticles(data || []);
    } catch (error: any) {
      console.error('Fetch articles error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryImages = async () => {
    setLoading(true);
    try {
      console.log('Fetching gallery images for:', selectedCountry);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('country', selectedCountry)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gallery images:', error);
        throw error;
      }
      console.log('Gallery images fetched:', data);
      setGalleryImages(data || []);
    } catch (error: any) {
      console.error('Fetch gallery images error:', error);
      toast({
        variant: "destructive",
        title: "Error fetching images",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editingId) {
      const generatedSlug = generateSlug(value);
      setSlug(generatedSlug);
      
      if (!metaTitle) {
        setMetaTitle(value);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      if (!altText && title) {
        setAltText(title);
      }
    }
  };

  const insertTextAtCursor = (beforeText: string, afterText: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    const newText = beforeText + selectedText + afterText;
    const newContent = content.substring(0, start) + newText + content.substring(end);
    
    setContent(newContent);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + beforeText.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleBold = () => insertTextAtCursor('**', '**');
  const handleItalic = () => insertTextAtCursor('*', '*');
  const handleUnderline = () => insertTextAtCursor('<u>', '</u>');
  const handleBulletList = () => insertTextAtCursor('\n- ');
  const handleNumberedList = () => insertTextAtCursor('\n1. ');

  const handleLink = () => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    setLinkText(selectedText);
    setShowLinkDialog(true);
  };

  const insertLink = () => {
    if (!linkUrl) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a URL",
      });
      return;
    }

    const displayText = linkText || linkUrl;
    const linkMarkdown = `[${displayText}](${linkUrl})`;
    
    const textarea = contentRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + linkMarkdown + content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + linkMarkdown.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }

    setShowLinkDialog(false);
    setLinkUrl('');
    setLinkText('');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading image to blog-images bucket:', filePath);

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !excerpt || !slug) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting article...');
      let featuredImage = null;
      
      if (selectedFile) {
        console.log('Uploading featured image...');
        featuredImage = await uploadImage(selectedFile);
      }

      const articleData = {
        title,
        content,
        excerpt,
        slug,
        featured_image: featuredImage,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt,
        alt_text: altText || title,
        tags: tags.length > 0 ? tags : null,
        published_at: new Date().toISOString(),
      };

      console.log('Article data:', articleData);

      if (editingId) {
        console.log('Updating article:', editingId);
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingId);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      } else {
        console.log('Creating new article...');
        const { error } = await supabase
          .from('articles')
          .insert([articleData]);

        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      }

      resetForm();
      fetchArticles();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setTitle(article.title);
    setContent(article.content);
    setExcerpt(article.excerpt);
    setSlug(article.slug);
    setMetaTitle(article.meta_title || '');
    setMetaDescription(article.meta_description || '');
    setAltText(article.alt_text || '');
    setTags(article.tags || []);
    setEditingId(article.id);
    if (article.featured_image) {
      setImagePreview(article.featured_image);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      console.log('Deleting article:', id);
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
      
      fetchArticles();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setExcerpt('');
    setSlug('');
    setMetaTitle('');
    setMetaDescription('');
    setAltText('');
    setTags([]);
    setTagInput('');
    setSelectedFile(null);
    setImagePreview(null);
    setEditingId(null);
  };

  const handleGalleryFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryUploadForm.file || !galleryUploadForm.title) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please provide both title and image file",
      });
      return;
    }

    setUploadLoading(true);
    try {
      const fileExt = galleryUploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = galleryUploadForm.folder
        ? `${galleryUploadForm.folder}/${fileName}`
        : `${fileName}`;

      console.log(`Uploading to gallery-${galleryUploadForm.country} bucket:`, filePath);

      const { error: uploadError } = await supabase.storage
        .from(`gallery-${galleryUploadForm.country}`)
        .upload(filePath, galleryUploadForm.file);

      if (uploadError) {
        console.error('Gallery upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(`gallery-${galleryUploadForm.country}`)
        .getPublicUrl(filePath);

      console.log('Gallery image uploaded:', publicUrl);

      const { error: dbError } = await supabase
        .from('gallery')
        .insert({
          country: galleryUploadForm.country,
          title: galleryUploadForm.title,
          description: galleryUploadForm.description || null,
          label: galleryUploadForm.label || null,
          image_url: publicUrl,
          image_path: filePath,
        });

      if (dbError) {
        console.error('Gallery DB error:', dbError);
        throw dbError;
      }

      toast({
        title: "Image uploaded successfully",
        description: "The image has been added to the gallery",
      });

      setGalleryUploadForm({ title: "", description: "", country: "singapore", label: "", folder: "", file: null });
      if (galleryUploadForm.country === selectedCountry) {
        fetchGalleryImages();
      }
    } catch (error: any) {
      console.error('Gallery upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGalleryEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setGalleryEditForm({
      title: image.title,
      description: image.description || "",
      label: image.label || "",
    });
  };

  const handleUpdateGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .update({
          title: galleryEditForm.title,
          description: galleryEditForm.description || null,
          label: galleryEditForm.label || null,
        })
        .eq('id', editingImage.id);

      if (error) throw error;

      toast({
        title: "Image updated successfully",
        description: "The image details have been updated",
      });

      setEditingImage(null);
      fetchGalleryImages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    }
  };

  const handleGalleryDelete = async (image: GalleryImage) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(`gallery-${image.country}`)
        .remove([image.image_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', image.id);

      if (dbError) throw dbError;

      toast({
        title: "Image deleted successfully",
        description: "The image has been removed from the gallery",
      });

      fetchGalleryImages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message,
      });
    }
  };

  const toggleGalleryVisibility = async (image: GalleryImage) => {
    try {
      const newLabel = image.label === 'private' ? null : 'private';
      
      const { error } = await supabase
        .from('gallery')
        .update({ label: newLabel })
        .eq('id', image.id);

      if (error) throw error;

      toast({
        title: "Visibility updated",
        description: `Image is now ${newLabel === 'private' ? 'hidden from' : 'visible to'} the public`,
      });

      fetchGalleryImages();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    }
  };

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  };

  const renderBlogEditor = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Article' : 'Create New Article'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="meta-title">SEO Meta Title</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Leave empty to use main title"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 characters</p>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="meta-description">SEO Meta Description</Label>
              <Textarea
                id="meta-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Leave empty to use excerpt"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 characters</p>
            </div>

            <div>
              <Label htmlFor="tags">Tags/Hashtags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Add tags (press Enter or click Add)"
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              
              <div className="border rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1 mb-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBold}
                  className="h-8 w-8 p-0"
                  title="Bold (**text**)"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleItalic}
                  className="h-8 w-8 p-0"
                  title="Italic (*text*)"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleUnderline}
                  className="h-8 w-8 p-0"
                  title="Underline (<u>text</u>)"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLink}
                  className="h-8 w-8 p-0"
                  title="Add Link"
                >
                  <Link className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBulletList}
                  className="h-8 w-8 p-0"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleNumberedList}
                  className="h-8 w-8 p-0"
                  title="Numbered List"
                >
                  <span className="text-xs font-bold">1.</span>
                </Button>
              </div>

              <Textarea
                ref={contentRef}
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                required
                className="rounded-t-none border-t-0"
                placeholder="Write your article content here. Use the toolbar above for formatting"
              />
              
              <div className="text-xs text-gray-500 mt-2">
                <strong>Formatting help:</strong> **bold**, *italic*, <u>underline</u>, [link text](URL), - bullet list, 1. numbered list
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">Featured Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="alt-text">Image Alt Text</Label>
                <Input
                  id="alt-text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="Descriptive text for accessibility"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Article' : 'Create Article'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="link-text">Link Text</Label>
                <Input
                  id="link-text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Text to display"
                />
              </div>
              <div>
                <Label htmlFor="link-url">URL *</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLinkDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={insertLink}>Insert Link</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Published Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 border rounded">
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.excerpt}</p>
                  <div className="flex gap-4 text-xs text-gray-400 mt-1">
                    <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    <span>Slug: /{article.slug}</span>
                    {article.meta_title && <span>SEO: ✓</span>}
                    {article.tags && article.tags.length > 0 && (
                      <span>Tags: {article.tags.length}</span>
                    )}
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(article)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderGalleryEditor = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Country</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGalleryFileUpload} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={galleryUploadForm.title}
                  onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, title: e.target.value })}
                  placeholder="Enter image title"
                  required
                />
              </div>
              <div>
                <Label>Country *</Label>
                <Select 
                  value={galleryUploadForm.country} 
                  onValueChange={(value) => setGalleryUploadForm({ ...galleryUploadForm, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={galleryUploadForm.description}
                onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, description: e.target.value })}
                placeholder="Enter image description"
                rows={3}
              />
            </div>
            
            <div>
              <Label>Label (Optional)</Label>
              <Input
                value={galleryUploadForm.label}
                onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, label: e.target.value })}
                placeholder="e.g., private (to hide from public)"
              />
            </div>

            <div>
              <Label>Folder (Optional)</Label>
              <Input
                value={galleryUploadForm.folder}
                onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, folder: e.target.value })}
                placeholder="Enter folder name"
              />
            </div>

            <div>
              <Label>Image File *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setGalleryUploadForm({ ...galleryUploadForm, file: e.target.files?.[0] || null })}
                required
              />
            </div>
            
            <Button type="submit" disabled={uploadLoading} className="w-full">
              {uploadLoading ? "Uploading..." : "Upload Image"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCountry.charAt(0).toUpperCase() + selectedCountry.slice(1)} Gallery ({galleryImages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : galleryImages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No images found for {selectedCountry}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{image.title}</h3>
                    {image.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={image.label === 'private'}
                          onCheckedChange={() => toggleGalleryVisibility(image)}
                        />
                        <span className="text-sm">Hide from public</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGalleryEdit(image)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGalleryDelete(image)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Image</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateGalleryImage} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={galleryEditForm.title}
                    onChange={(e) => setGalleryEditForm({ ...galleryEditForm, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={galleryEditForm.description}
                    onChange={(e) => setGalleryEditForm({ ...galleryEditForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Label</Label>
                  <Input
                    value={galleryEditForm.label}
                    onChange={(e) => setGalleryEditForm({ ...galleryEditForm, label: e.target.value })}
                    placeholder="e.g., private"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingImage(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  if (!isLoggedIn) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Add padding top to account for fixed navigation */}
      <div className="pt-32">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Blog & Gallery Editor</h1>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Content Management</h2>
            
            <div className="flex gap-4 mb-6">
              <Button
                variant={activeView === "blog" ? "default" : "outline"}
                onClick={() => handleViewChange("blog")}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Blog Editor
              </Button>
              <Button
                variant={activeView === "gallery" ? "default" : "outline"}
                onClick={() => handleViewChange("gallery")}
                className="flex items-center gap-2"
              >
                <Image className="h-4 w-4" />
                Gallery Editor
              </Button>
            </div>
          </div>

          {activeView === "blog" ? renderBlogEditor() : renderGalleryEditor()}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogEditor;
