import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ArrowLeft, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProductCardSkeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { validateProductForm, sanitizeInput } from '@/lib/validation';
import { productsAPI, uploadAPI } from '@/lib/api';
import { useEffect } from 'react';
import type { Product } from '@/lib/mockData';

export default function ProductManagementPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Get shop ID from localStorage (in real app, from auth context)
  const shopId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('shop_profile') || '{}')?.id || '1' : '1';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsAPI.getAll({ shopId });
        if (!cancelled) {
          setProducts(response.products || []);
        }
      } catch (error: any) {
        if (!cancelled) {
          toast.error(error.message || 'Failed to load products');
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    loadProducts();
    
    return () => {
      cancelled = true;
    };
  }, [shopId]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock?.toString() || '',
        image: product.image,
      });
      setImagePreview(product.image || null);
      setImageFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
      });
      setImagePreview(null);
      setImageFile(null);
    }
    setErrors({});
    setIsModalOpen(true);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
      setFormData({ ...formData, image: '' }); // Clear URL input when file is selected
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateProductForm({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
    });

    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl: string = formData.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop';

      // Upload image if a file was selected
      if (imageFile) {
        setUploadingImage(true);
        try {
          const uploadResult = await uploadAPI.uploadFile(imageFile);
          imageUrl = uploadResult.url;
        } catch (uploadError: any) {
          toast.error(uploadError.message || 'Failed to upload image');
          setIsSubmitting(false);
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const newProduct: Product = {
        id: editingProduct?.id || `p${Date.now()}`,
        name: sanitizeInput(formData.name),
        description: sanitizeInput(formData.description),
        price: parseFloat(formData.price),
        category: sanitizeInput(formData.category),
        shopId,
        inStock: parseInt(formData.stock) > 0,
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        image: imageUrl,
      };

      if (editingProduct) {
        const response = await productsAPI.update(editingProduct.id, newProduct);
        setProducts(products.map((p) => (p.id === editingProduct.id ? response.product : p)));
        toast.success('Product updated successfully!');
      } else {
        const response = await productsAPI.create(newProduct);
        setProducts([...products, response.product]);
        toast.success('Product added successfully!');
      }
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    // Optimistic update - remove immediately
    const originalProducts = [...products];
    setProducts(products.filter((p) => p.id !== productId));

    try {
      await productsAPI.delete(productId);
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      // Revert on error
      setProducts(originalProducts);
      toast.error(error.message || 'Failed to delete product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-muted/5 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/shopkeeper/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Product Management</h1>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first product</p>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {!product.inStock && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-orange-600">₹{product.price}</span>
                      <span className="text-xs text-gray-500">{product.category}</span>
                    </div>
                    {product.stock !== undefined && (
                      <p className="text-xs text-gray-500 mb-3">Stock: {product.stock}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleOpenModal(product)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    className="w-full rounded border p-2 min-h-[100px]"
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                    />
                    {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Electronics"
                    />
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1">{errors.category}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Product Image</Label>
                    <div className="space-y-2">
                      <input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFile}
                        className="mt-2"
                        disabled={uploadingImage || isSubmitting}
                      />
                      {uploadingImage && (
                        <p className="text-sm text-gray-600">Uploading image...</p>
                      )}
                      <Input
                        id="image"
                        type="url"
                        value={formData.image}
                        onChange={(e) => {
                          setFormData({ ...formData, image: e.target.value });
                          if (e.target.value) {
                            setImagePreview(e.target.value);
                            setImageFile(null);
                          }
                        }}
                        placeholder="Or enter image URL: https://example.com/image.jpg"
                        disabled={uploadingImage || isSubmitting}
                      />
                      {imagePreview && (
                        <div className="mt-3 w-32 h-32 rounded overflow-hidden border">
                          <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSubmitting || uploadingImage}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting || uploadingImage}>
                    {isSubmitting || uploadingImage ? (
                      <span className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        {uploadingImage ? 'Uploading...' : editingProduct ? 'Updating...' : 'Adding...'}
                      </span>
                    ) : (
                      editingProduct ? 'Update Product' : 'Add Product'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

